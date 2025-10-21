import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'expense' | 'settlement';
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  groupName?: string;
  category: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: 25.50,
    currency: 'EUR',
    description: 'Za kosilo',
    recipient: 'ALJAŽ V.',
    date: '2024-01-15',
    status: 'completed',
    category: 'Hrana in pijača',
  },
  {
    id: '2',
    type: 'expense',
    amount: 87.25,
    currency: 'EUR',
    description: 'Hotelski račun',
    date: '2024-01-14',
    status: 'completed',
    groupName: 'Potovanje v Italijo',
    category: 'Nastanitev',
  },
  {
    id: '3',
    type: 'received',
    amount: 45.30,
    currency: 'EUR',
    description: 'Sporočilo',
    recipient: 'MARTA K.',
    date: '2024-01-13',
    status: 'completed',
    category: 'Prejemek',
  },
  {
    id: '4',
    type: 'settlement',
    amount: 12.50,
    currency: 'EUR',
    description: 'Poravnava dolga',
    recipient: 'PETRA M.',
    date: '2024-01-12',
    status: 'completed',
    groupName: 'Večerja',
    category: 'Hrana in pijača',
  },
];

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [directionFilter, setDirectionFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'group'>('all');

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'sent' || type === 'expense' ? '-' : '+';
    return `${sign}${amount.toFixed(2)} EUR`;
  };

  const getTransactionIcon = (type: string, groupName?: string) => {
    // Use group icon if transaction is part of a group
    if (groupName) {
      return 'person.3.fill';
    }
    
    switch (type) {
      case 'sent':
        return 'arrow.up.right';
      case 'received':
        return 'arrow.down.left';
      case 'expense':
        return 'creditcard';
      case 'settlement':
        return 'checkmark.circle';
      default:
        return 'circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sent':
      case 'expense':
        return Colors[colorScheme ?? 'light'].error;
      case 'received':
      case 'settlement':
        return Colors[colorScheme ?? 'light'].success;
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Direction filter
    const directionMatch = directionFilter === 'all' || 
      (directionFilter === 'sent' && transaction.type === 'sent') ||
      (directionFilter === 'received' && (transaction.type === 'received' || transaction.type === 'settlement'));
    
    // Type filter
    const typeMatch = typeFilter === 'all' ||
      (typeFilter === 'individual' && !transaction.groupName) ||
      (typeFilter === 'group' && transaction.groupName);
    
    return directionMatch && typeMatch;
  });

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={[
        styles.transactionCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionIcon}>
          <IconSymbol
            name={getTransactionIcon(transaction.type, transaction.groupName)}
            size={20}
            color={getTransactionColor(transaction.type)}
          />
        </View>
        <View style={styles.transactionInfo}>
          <ThemedText type="defaultSemiBold" style={styles.transactionDescription}>
            {transaction.description}
          </ThemedText>
          {transaction.recipient && (
            <ThemedText style={styles.transactionRecipient}>
              {transaction.recipient}
            </ThemedText>
          )}
          {transaction.groupName && (
            <ThemedText style={styles.transactionGroup}>
              {transaction.groupName}
            </ThemedText>
          )}
          <ThemedText style={styles.transactionCategory}>
            {transaction.category}
          </ThemedText>
        </View>
        <View style={styles.transactionAmount}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.amountText,
              { color: getTransactionColor(transaction.type) },
            ]}
          >
            {formatAmount(transaction.amount, transaction.type)}
          </ThemedText>
          <ThemedText style={styles.transactionDate}>
            {formatDate(transaction.date)}
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
            Transakcije
          </ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol name="line.3.horizontal.decrease" size={24} color={Colors[colorScheme ?? 'light'].primary} />
          </TouchableOpacity>
        </View>

        {/* Direction Filter */}
        <View style={styles.filterRow}>
          <ThemedText style={styles.filterLabel}>Smer:</ThemedText>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                directionFilter === 'all' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setDirectionFilter('all')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  directionFilter === 'all' && { color: 'white' },
                ]}
              >
                Vse
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                directionFilter === 'sent' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setDirectionFilter('sent')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  directionFilter === 'sent' && { color: 'white' },
                ]}
              >
                Poslane
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                directionFilter === 'received' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setDirectionFilter('received')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  directionFilter === 'received' && { color: 'white' },
                ]}
              >
                Prejete
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.filterRow}>
          <ThemedText style={styles.filterLabel}>Tip:</ThemedText>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                typeFilter === 'all' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setTypeFilter('all')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  typeFilter === 'all' && { color: 'white' },
                ]}
              >
                Vse
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                typeFilter === 'individual' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setTypeFilter('individual')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  typeFilter === 'individual' && { color: 'white' },
                ]}
              >
                Individualne
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                typeFilter === 'group' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => setTypeFilter('group')}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  typeFilter === 'group' && { color: 'white' },
                ]}
              >
                Skupinske
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsList}>
          {filteredTransactions.map(renderTransaction)}
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
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 2,
    flex: 1,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  transactionsList: {
    marginBottom: 12,
  },
  transactionCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,102,204,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  transactionRecipient: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 1,
  },
  transactionGroup: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  transactionCategory: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: '500',
    marginTop: 2,
    color: '#0066CC',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    opacity: 0.6,
  },
});
