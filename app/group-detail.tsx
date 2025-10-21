import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface GroupMember {
  id: string;
  name: string;
  phone: string;
  balance: number;
  avatar?: string;
}

interface GroupExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  category: string;
}

export default function GroupDetailScreen() {
  const colorScheme = useColorScheme();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
  });

  const groupData = {
    id: '1',
    name: 'Potovanje v Italijo',
    members: [
      { id: '1', name: 'Janez Novak', phone: '+386 40 123 456', balance: -87.25 },
      { id: '2', name: 'ALJAŽ V.', phone: '+386 40 102 030', balance: 45.30 },
      { id: '3', name: 'MARTA K.', phone: '+386 41 234 567', balance: 23.15 },
      { id: '4', name: 'PETRA M.', phone: '+386 42 345 678', balance: 18.80 },
    ],
    totalExpenses: 1250.50,
    budget: 1500.00,
    expenses: [
      {
        id: '1',
        description: 'Hotelski račun',
        amount: 320.00,
        paidBy: 'Janez Novak',
        splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
        date: '2024-01-14',
        category: 'accommodation',
      },
      {
        id: '2',
        description: 'Večerja v restavraciji',
        amount: 85.50,
        paidBy: 'ALJAŽ V.',
        splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
        date: '2024-01-13',
        category: 'food',
      },
      {
        id: '3',
        description: 'Benzin',
        amount: 45.00,
        paidBy: 'MARTA K.',
        splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
        date: '2024-01-12',
        category: 'transport',
      },
    ],
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
    if (!newExpense.description || !newExpense.amount) {
      Alert.alert('Napaka', 'Prosimo, vnesite opis in znesek.');
      return;
    }

    Alert.alert('Uspeh', 'Strošek je bil dodan!');
    setShowAddExpense(false);
    setNewExpense({ description: '', amount: '', category: 'food' });
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
            onPress={() => setShowAddExpense(true)}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Dodaj strošek</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}>
            <IconSymbol name="chart.bar" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Statistike
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Add Expense Form */}
        {showAddExpense && (
          <View style={styles.addExpenseForm}>
            <ThemedText type="subtitle" style={styles.formTitle}>Dodaj nov strošek</ThemedText>
            <TextInput
              style={[styles.formInput, { color: Colors[colorScheme ?? 'light'].text }]}
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
              placeholder="Opis stroška..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            />
            <TextInput
              style={[styles.formInput, { color: Colors[colorScheme ?? 'light'].text }]}
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              placeholder="Znesek..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              keyboardType="numeric"
            />
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
                <ThemedText style={styles.saveButtonText}>Shrani</ThemedText>
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
});
