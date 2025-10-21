import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Group {
  id: string;
  name: string;
  members: number;
  totalExpenses: number;
  yourBalance: number;
  currency: string;
  color: string;
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Potovanje v Italijo',
    members: 4,
    totalExpenses: 1250.50,
    yourBalance: -87.25,
    currency: 'EUR',
    color: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Stanovanje',
    members: 3,
    totalExpenses: 890.00,
    yourBalance: 45.30,
    currency: 'EUR',
    color: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Večerja',
    members: 6,
    totalExpenses: 180.75,
    yourBalance: -12.50,
    currency: 'EUR',
    color: '#45B7D1',
  },
];

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const [groups] = useState<Group[]>(mockGroups);

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return Colors[colorScheme ?? 'light'].success;
    if (balance < 0) return Colors[colorScheme ?? 'light'].error;
    return Colors[colorScheme ?? 'light'].text;
  };

  const renderGroupCard = (group: Group) => (
    <TouchableOpacity
      key={group.id}
      style={[
        styles.groupCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
        { borderLeftColor: group.color },
      ]}
      onPress={() => router.push('/group-detail')}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <ThemedText type="subtitle" style={styles.groupName}>
            {group.name}
          </ThemedText>
          <ThemedText style={styles.memberCount}>
            {group.members} članov
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
            style={[styles.statValue, { color: getBalanceColor(group.yourBalance) }]}
          >
            {group.yourBalance > 0 ? '+' : ''}{formatAmount(group.yourBalance)}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Skupine
          </ThemedText>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus" size={24} color={Colors[colorScheme ?? 'light'].primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
            <IconSymbol name="plus" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Nova skupina</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}>
            <IconSymbol name="person.badge.plus" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Pridruži se
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.groupsList}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Vaše skupine
          </ThemedText>
          {groups.map(renderGroupCard)}
        </View>

        <View style={styles.budgetSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Skupni proračuni
          </ThemedText>
          <TouchableOpacity style={[styles.budgetCard, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}>
            <View style={styles.budgetInfo}>
              <ThemedText type="defaultSemiBold" style={styles.budgetTitle}>
                Potovanje v Italijo
              </ThemedText>
              <ThemedText style={styles.budgetAmount}>
                1,250.50 EUR / 1,500.00 EUR
              </ThemedText>
            </View>
            <View style={styles.budgetProgress}>
              <View style={[styles.progressBar, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]} />
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
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
    fontWeight: '600',
  },
  groupsList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  groupCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
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
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetSection: {
    marginBottom: 24,
  },
  budgetCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  budgetInfo: {
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 14,
    opacity: 0.7,
  },
  budgetProgress: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '83%', // 1250.50 / 1500.00
    borderRadius: 3,
  },
});
