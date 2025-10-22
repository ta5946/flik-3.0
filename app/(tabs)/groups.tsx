import AddGroupModal from '@/components/AddGroupModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const { groups } = useGroups();
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return Colors[colorScheme ?? 'light'].success;
    if (balance < 0) return Colors[colorScheme ?? 'light'].error;
    return Colors[colorScheme ?? 'light'].text;
  };

        <View style={styles.groupsList}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Vaše skupine
          </ThemedText>
          {groups.map((group) => {
            const yourBalance = group.members.length > 0 ? group.members[0].balance : 0;
            const progressPercentage = group.budget > 0 ? (group.totalExpenses / group.budget) * 100 : 0;
            
            return (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].background },
                  { borderLeftColor: group.color },
                ]}
                onPress={() => router.push(`/group-detail?id=${group.id}`)}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <ThemedText type="subtitle" style={styles.groupName}>
                      {group.name}
                    </ThemedText>
                    <ThemedText style={styles.memberCount}>
                      {group.members.length} članov
                    </ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].icon} />
                </View>
                
                <View style={styles.groupStats}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Skupni stroški</ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.statValue}>
                      {formatAmount(group.totalExpenses)}
                    </ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Vaš saldo</ThemedText>
                    <ThemedText 
                      type="defaultSemiBold" 
                      style={[styles.statValue, { color: getBalanceColor(yourBalance) }]}
                    >
                      {yourBalance > 0 ? '+' : ''}{formatAmount(yourBalance)}
                    </ThemedText>
                  </View>
                </View>

                {/* Budget Progress - only show if budget is set */}
                {group.budget > 0 && (
                  <View style={styles.budgetProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: group.color,
                            width: `${Math.min(progressPercentage, 100)}%`
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Skupine
          </ThemedText>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => setShowAddGroupModal(true)}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Nova skupina</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}>
            <IconSymbol name="person.fill" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Pridruži se
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.groupsList}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Vaše skupine
          </ThemedText>
          {groups.length > 0 ? (
            groups.map((group) => {
            const yourBalance = group.members.length > 0 ? group.members[0].balance : 0;
            const progressPercentage = group.budget > 0 ? (group.totalExpenses / group.budget) * 100 : 0;
            
            return (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].background },
                  { borderLeftColor: group.color },
                ]}
                onPress={() => router.push(`/group-detail?id=${group.id}`)}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <ThemedText type="subtitle" style={styles.groupName}>
                      {group.name}
                    </ThemedText>
                    <ThemedText style={styles.memberCount}>
                      {group.members.length} članov
                    </ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].icon} />
                </View>
                
                <View style={styles.groupStats}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Skupni stroški</ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.statValue}>
                      {formatAmount(group.totalExpenses)}
                    </ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Vaš saldo</ThemedText>
                    <ThemedText 
                      type="defaultSemiBold" 
                      style={[styles.statValue, { color: getBalanceColor(yourBalance) }]}
                    >
                      {yourBalance > 0 ? '+' : ''}{formatAmount(yourBalance)}
                    </ThemedText>
                  </View>
                </View>

                {/* Budget Progress - only show if budget is set */}
                {group.budget > 0 && (
                  <View style={styles.budgetProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: group.color,
                            width: `${Math.min(progressPercentage, 100)}%`
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
            })
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                Še nimate nobene skupine. Ustvarite prvo skupino z gumbom zgoraj.
              </ThemedText>
            </View>
          )}
        </View>

      </ScrollView>
      
      <AddGroupModal 
        visible={showAddGroupModal} 
        onClose={() => setShowAddGroupModal(false)} 
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontWeight: '600',
  },
  groupsList: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  groupCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
});
