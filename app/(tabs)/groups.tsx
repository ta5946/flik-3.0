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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const { groups } = useGroups();
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const insets = useSafeAreaInsets();

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return Colors[colorScheme ?? 'light'].success;
    if (balance < 0) return Colors[colorScheme ?? 'light'].error;
    return Colors[colorScheme ?? 'light'].text;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <IconSymbol name="creditcard.fill" size={24} color="white" />
              </View>
              <ThemedText type="title" style={styles.headerTitle}>
                Flik Pay
              </ThemedText>
            </View>
            <ThemedText style={styles.headerSubtitle}>
              Upravljajte svoje skupine in stroške
            </ThemedText>
          </View>
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
                  group.closed && styles.closedGroupCard,
                  
                ]}
                onPress={() => router.push(`/group-detail?id=${group.id}`)}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <View style={styles.groupNameRow}>
                      <View style={[styles.groupDot, { backgroundColor: group.color }]} />
                      <ThemedText type="subtitle" style={[styles.groupName, styles.groupNameInRow]}>
                        {group.name}
                      </ThemedText>
                      {group.closed && (
                        <View style={styles.closedBadge}>
                          <IconSymbol name="checkmark.circle.fill" size={12} color="white" />
                          <ThemedText style={styles.closedBadgeText}>ZAPRTA</ThemedText>
                        </View>
                      )}
                    </View>
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
          }))
          : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                Še nimate nobene skupine. Ustvarite prvo skupino z gumbom zgoraj.
              </ThemedText>
            </View>
          )}
        </View>

        {/* Add Group Button */}
        <View style={styles.addGroupSection}>
          <TouchableOpacity 
            style={styles.addGroupButton}
            onPress={() => setShowAddGroupModal(true)}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <ThemedText style={styles.addGroupButtonText}>
              Ustvari novo skupino
            </ThemedText>
          </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#1e40af', // Flik Pay blue
  },
  headerContent: {
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  groupsList: {
    paddingHorizontal: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  groupCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1e293b',
  },
  groupNameInRow: {
    marginBottom: 0,
  },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    alignSelf: 'center',
  },
  closedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  closedBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  closedGroupCard: {
    opacity: 0.7,
    borderColor: '#10B981',
    borderWidth: 1,
  },
  addGroupSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  addGroupButton: {
    backgroundColor: '#1e40af', // Flik Pay blue
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addGroupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
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
