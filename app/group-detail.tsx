import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { GroupExpense, GroupMember, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function GroupDetailScreen() {
  const colorScheme = useColorScheme();
  const { getGroupById, addExpense } = useGroups();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    paidBy: '',
    splitBetween: [] as string[],
  });
  const [splitMode, setSplitMode] = useState<'equal' | 'shares' | 'percentage'>('equal');
  const [memberShares, setMemberShares] = useState<Record<string, number>>({});
  const [memberPercentages, setMemberPercentages] = useState<Record<string, number>>({});

  const groupData = getGroupById(id || '1');

  if (!groupData) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Skupina ni najdena
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Derived: owner name and defaults
  const ownerName = useMemo(() => {
    const owner = groupData.members.find(m => m.id === groupData.ownerId);
    return owner?.name ?? groupData.members[0]?.name ?? '';
  }, [groupData]);

  // Ensure sensible defaults when opening the form
  const openAddExpense = () => {
    const allMembers = groupData.members.map(m => m.name);
    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      paidBy: ownerName,
      splitBetween: allMembers,
    });
    setSplitMode('equal');
    setMemberShares({});
    setMemberPercentages({});
    setShowAddExpense(true);
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return Colors[colorScheme ?? 'light'].success;
    if (balance < 0) return Colors[colorScheme ?? 'light'].error;
    return Colors[colorScheme ?? 'light'].text;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return 'fork.knife';
      case 'accommodation':
        return 'bed.double';
      case 'transport':
        return 'car';
      case 'entertainment':
        return 'gamecontroller';
      default:
        return 'creditcard';
    }
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      Alert.alert('Napaka', 'Prosimo, vnesite opis, znesek in izberite kdo je plačal.');
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Napaka', 'Prosimo, vnesite veljaven znesek.');
      return;
    }

    // Budget validation with confirmation
    const projectedTotal = groupData.totalExpenses + amount;
    if (groupData.budget > 0 && projectedTotal > groupData.budget) {
      Alert.alert(
        'Presežen proračun',
        'Ta strošek bo presegel proračun skupine. Želite vseeno nadaljevati?',
        [
          { text: 'Prekliči', style: 'cancel' },
          { text: 'Nadaljuj', style: 'default', onPress: () => finalizeAddExpense(amount) },
        ]
      );
      return;
    }

    // Continue to finalize if within budget
    finalizeAddExpense(amount);
  };

  const finalizeAddExpense = (amount: number) => {
    // Validate split mode specific requirements
    if (splitMode === 'shares') {
      const totalShares = newExpense.splitBetween.reduce((sum, name) => sum + (memberShares[name] || 0), 0);
      if (totalShares <= 0) {
        Alert.alert('Napaka', 'Prosimo, vnesite deleže za vse izbrane člane.');
        return;
      }
    } else if (splitMode === 'percentage') {
      const totalPercentage = newExpense.splitBetween.reduce((sum, name) => sum + (memberPercentages[name] || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        Alert.alert('Napaka', 'Deleži morajo znašati 100%.');
        return;
      }
    }

    // If no members are selected for splitting, split between all members
    const splitBetween = newExpense.splitBetween.length > 0 
      ? newExpense.splitBetween 
      : groupData.members.map(member => member.name);

    addExpense(groupData.id, {
      description: newExpense.description,
      amount: amount,
      paidBy: newExpense.paidBy,
      splitBetween: splitBetween,
      category: newExpense.category,
    });

    Alert.alert('Uspeh', 'Strošek je bil dodan!');
    setShowAddExpense(false);
    setNewExpense({ 
      description: '', 
      amount: '', 
      category: 'food',
      paidBy: '',
      splitBetween: []
    });
    setMemberShares({});
    setMemberPercentages({});
  };

  const renderMember = (member: GroupMember) => (
    <TouchableOpacity key={member.id} style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <ThemedText style={styles.memberInitial}>
          {member.name.charAt(0)}
        </ThemedText>
      </View>
      <View style={styles.memberInfo}>
        <ThemedText type="defaultSemiBold" style={styles.memberName}>
          {member.name}
        </ThemedText>
        <ThemedText style={styles.memberPhone}>
          {member.phone}
        </ThemedText>
      </View>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.memberBalance, { color: getBalanceColor(member.balance) }]}
      >
        {member.balance > 0 ? '+' : ''}{formatAmount(member.balance)}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderExpense = (expense: GroupExpense) => (
    <TouchableOpacity key={expense.id} style={styles.expenseCard}>
      <View style={styles.expenseIcon}>
        <IconSymbol
          name={getCategoryIcon(expense.category)}
          size={20}
          color={Colors[colorScheme ?? 'light'].primary}
        />
      </View>
      <View style={styles.expenseInfo}>
        <ThemedText type="defaultSemiBold" style={styles.expenseDescription}>
          {expense.description}
        </ThemedText>
        <ThemedText style={styles.expenseDetails}>
          Plačal: {expense.paidBy} • {expense.date}
        </ThemedText>
        <ThemedText style={styles.expenseSplit}>
          Razdeljeno med {expense.splitBetween.length} člane
        </ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={styles.expenseAmount}>
        {formatAmount(expense.amount)}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            {groupData.name}
          </ThemedText>
          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol name="ellipsis" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        {/* Group Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Skupni stroški</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {formatAmount(groupData.totalExpenses)}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Proračun</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {formatAmount(groupData.budget)}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Preostalo</ThemedText>
            <ThemedText 
              type="defaultSemiBold" 
              style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].success }]}
            >
              {formatAmount(groupData.budget - groupData.totalExpenses)}
            </ThemedText>
          </View>
        </View>

        {/* Budget Progress */}
        <View style={styles.budgetProgress}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressLabel}>Proračunski napredek</ThemedText>
            <ThemedText style={styles.progressPercentage}>
              {Math.round((groupData.totalExpenses / groupData.budget) * 100)}%
            </ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(groupData.totalExpenses / groupData.budget) * 100}%`,
                  backgroundColor: Colors[colorScheme ?? 'light'].primary,
                }
              ]} 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={openAddExpense}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Dodaj strošek</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}
            onPress={() => setShowStats(prev => !prev)}
          >
            <IconSymbol name="chart.bar" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Statistike
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        {showStats && (
          <View style={styles.statsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Statistike</ThemedText>

            {/* Per-member balances */}
            <View style={styles.statsCard}>
              <ThemedText style={styles.statHeader}>Stanja po članih</ThemedText>
              {groupData.members.map(m => (
                <View key={m.id} style={styles.statRow}>
                  <ThemedText style={styles.statRowName}>{m.name}</ThemedText>
                  <ThemedText style={[styles.statRowValue, { color: getBalanceColor(m.balance) }]}>
                    {m.balance > 0 ? '+' : ''}{formatAmount(m.balance)}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* Category breakdown */}
            <View style={styles.statsCard}>
              <ThemedText style={styles.statHeader}>Po kategorijah</ThemedText>
              {['food','accommodation','transport','entertainment','other'].map(cat => {
                const total = groupData.expenses
                  .filter(e => (['food','accommodation','transport','entertainment'].includes(e.category) ? e.category : 'other') === cat)
                  .reduce((sum, e) => sum + e.amount, 0);
                return (
                  <View key={cat} style={styles.statRow}>
                    <ThemedText style={styles.statRowName}>{cat}</ThemedText>
                    <ThemedText style={styles.statRowValue}>{formatAmount(total)}</ThemedText>
                  </View>
                );
              })}
            </View>

            {/* Monthly totals */}
            <View style={styles.statsCard}>
              <ThemedText style={styles.statHeader}>Mesečno</ThemedText>
              {Object.entries(groupData.expenses.reduce<Record<string, number>>((acc, e) => {
                const ym = (e.date || '').slice(0,7);
                if (!ym) return acc;
                acc[ym] = (acc[ym] || 0) + e.amount;
                return acc;
              }, {})).sort(([a],[b]) => a.localeCompare(b)).map(([ym, total]) => (
                <View key={ym} style={styles.statRow}>
                  <ThemedText style={styles.statRowName}>{ym}</ThemedText>
                  <ThemedText style={styles.statRowValue}>{formatAmount(total)}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Add Expense Form */}
        {showAddExpense && (
          <View style={styles.addExpenseForm}>
            <ThemedText type="subtitle" style={styles.formTitle}>Dodaj nov strošek</ThemedText>
            
            {/* Description */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Opis</ThemedText>
              <TextInput
                style={[styles.formInput, { color: Colors[colorScheme ?? 'light'].text }]}
                value={newExpense.description}
                onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
                placeholder="Kaj ste plačali?"
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              />
            </View>
            
            {/* Amount */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Znesek</ThemedText>
              <TextInput
                style={[styles.formInput, { color: Colors[colorScheme ?? 'light'].text }]}
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                placeholder="0.00"
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                keyboardType="numeric"
              />
            </View>

            {/* Paid By Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Kdo je plačal?</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
                {groupData.members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberChip,
                      newExpense.paidBy === member.name && styles.selectedChip
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, paidBy: member.name })}
                  >
                    <ThemedText style={[
                      styles.chipText,
                      newExpense.paidBy === member.name && styles.selectedChipText
                    ]}>
                      {member.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Split Mode Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Kako razdeli strošek?</ThemedText>
              <View style={styles.splitModeContainer}>
                <TouchableOpacity
                  style={[styles.splitModeButton, splitMode === 'equal' && styles.splitModeButtonActive]}
                  onPress={() => setSplitMode('equal')}
                >
                  <ThemedText style={[styles.splitModeText, splitMode === 'equal' && styles.splitModeTextActive]}>
                    Enakomerno
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.splitModeButton, splitMode === 'shares' && styles.splitModeButtonActive]}
                  onPress={() => setSplitMode('shares')}
                >
                  <ThemedText style={[styles.splitModeText, splitMode === 'shares' && styles.splitModeTextActive]}>
                    Deleži
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.splitModeButton, splitMode === 'percentage' && styles.splitModeButtonActive]}
                  onPress={() => setSplitMode('percentage')}
                >
                  <ThemedText style={[styles.splitModeText, splitMode === 'percentage' && styles.splitModeTextActive]}>
                    Odstotki
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Split Between Selection */}
            <View style={styles.inputGroup}>
              <View style={styles.splitHeader}>
                <ThemedText style={styles.inputLabel}>Razdeli med</ThemedText>
                <View style={styles.splitActions}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setNewExpense({ ...newExpense, splitBetween: groupData.members.map(m => m.name) })}
                  >
                    <ThemedText style={styles.smallButtonText}>Vsi</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setNewExpense({ ...newExpense, splitBetween: [] })}
                  >
                    <ThemedText style={styles.smallButtonText}>Nihče</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
                {groupData.members.map((member) => {
                  const isSelected = newExpense.splitBetween.includes(member.name);
                  return (
                    <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberChip,
                        isSelected && styles.selectedChip
                      ]}
                      onPress={() => {
                        const newSplitBetween = isSelected
                          ? newExpense.splitBetween.filter(name => name !== member.name)
                          : [...newExpense.splitBetween, member.name];
                        setNewExpense({ ...newExpense, splitBetween: newSplitBetween });
                      }}
                    >
                      <ThemedText style={[
                        styles.chipText,
                        isSelected && styles.selectedChipText
                      ]}>
                        {member.name}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Split Details */}
            {newExpense.splitBetween.length > 0 && newExpense.amount && (
              <View style={styles.splitDetails}>
                <ThemedText style={styles.splitDetailsTitle}>Razdelitev</ThemedText>
                {newExpense.splitBetween.map((memberName) => {
                  const amount = parseFloat(newExpense.amount);
                  let memberAmount = 0;
                  let displayText = '';

                  if (splitMode === 'equal') {
                    memberAmount = amount / newExpense.splitBetween.length;
                    displayText = formatAmount(memberAmount);
                  } else if (splitMode === 'shares') {
                    const totalShares = newExpense.splitBetween.reduce((sum, name) => sum + (memberShares[name] || 0), 0);
                    if (totalShares > 0) {
                      memberAmount = (amount * (memberShares[memberName] || 0)) / totalShares;
                      displayText = `${formatAmount(memberAmount)} (${memberShares[memberName] || 0} deležev)`;
                    } else {
                      displayText = 'Vnesite deleže';
                    }
                  } else if (splitMode === 'percentage') {
                    memberAmount = (amount * (memberPercentages[memberName] || 0)) / 100;
                    displayText = `${formatAmount(memberAmount)} (${memberPercentages[memberName] || 0}%)`;
                  }

                  return (
                    <View key={memberName} style={styles.splitDetailRow}>
                      <ThemedText style={styles.splitDetailName}>{memberName}</ThemedText>
                      <ThemedText style={styles.splitDetailAmount}>{displayText}</ThemedText>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Share/Percentage Inputs */}
            {splitMode === 'shares' && newExpense.splitBetween.length > 0 && (
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Deleži</ThemedText>
                {newExpense.splitBetween.map((memberName) => (
                  <View key={memberName} style={styles.shareInputRow}>
                    <ThemedText style={styles.shareInputLabel}>{memberName}</ThemedText>
                    <TextInput
                      style={[styles.shareInput, { color: Colors[colorScheme ?? 'light'].text }]}
                      value={memberShares[memberName]?.toString() || ''}
                      onChangeText={(text) => {
                        const value = parseFloat(text) || 0;
                        setMemberShares(prev => ({ ...prev, [memberName]: value }));
                      }}
                      placeholder="0"
                      placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            )}

            {splitMode === 'percentage' && newExpense.splitBetween.length > 0 && (
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Odstotki</ThemedText>
                {newExpense.splitBetween.map((memberName) => (
                  <View key={memberName} style={styles.shareInputRow}>
                    <ThemedText style={styles.shareInputLabel}>{memberName}</ThemedText>
                    <TextInput
                      style={[styles.shareInput, { color: Colors[colorScheme ?? 'light'].text }]}
                      value={memberPercentages[memberName]?.toString() || ''}
                      onChangeText={(text) => {
                        const value = parseFloat(text) || 0;
                        setMemberPercentages(prev => ({ ...prev, [memberName]: value }));
                      }}
                      placeholder="0"
                      placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                      keyboardType="numeric"
                    />
                    <ThemedText style={styles.percentageSymbol}>%</ThemedText>
                  </View>
                ))}
                <ThemedText style={styles.percentageTotal}>
                  Skupaj: {newExpense.splitBetween.reduce((sum, name) => sum + (memberPercentages[name] || 0), 0)}%
                </ThemedText>
              </View>
            )}
            
            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowAddExpense(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Prekliči</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddExpense}
              >
                <ThemedText style={styles.saveButtonText}>Dodaj strošek</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Members */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Člani skupine ({groupData.members.length})
          </ThemedText>
          {groupData.members.map(renderMember)}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Zadnji stroški
          </ThemedText>
          {groupData.expenses.map(renderExpense)}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statRowName: {
    fontSize: 14,
    color: '#444',
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetProgress: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addExpenseForm: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#0066CC',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  memberBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    marginBottom: 2,
  },
  expenseDetails: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  expenseSplit: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberSelection: {
    marginBottom: 16,
  },
  selectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberScroll: {
    flexDirection: 'row',
  },
  memberChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedChipText: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  splitModeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  splitModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  splitModeButtonActive: {
    backgroundColor: '#0066CC',
  },
  splitModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  splitModeTextActive: {
    color: 'white',
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  splitDetails: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  splitDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  splitDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  splitDetailName: {
    fontSize: 14,
    color: '#666',
  },
  splitDetailAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  shareInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareInputLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  shareInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    marginRight: 8,
  },
  percentageSymbol: {
    fontSize: 14,
    color: '#666',
    width: 20,
  },
  percentageTotal: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
