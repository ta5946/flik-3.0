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
  },
];

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'expenses'>('all');

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'sent' || type === 'expense' ? '-' : '+';
    return `${sign}${amount.toFixed(2)} EUR`;
  };

  const getTransactionIcon = (type: string) => {
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
    if (filter === 'all') return true;
    if (filter === 'sent') return transaction.type === 'sent';
    if (filter === 'received') return transaction.type === 'received';
    if (filter === 'expenses') return transaction.type === 'expense';
    return true;
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
            name={getTransactionIcon(transaction.type)}
            size={24}
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

        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'all' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('all')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'all' && { color: 'white' },
              ]}
            >
              Vse
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'sent' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('sent')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'sent' && { color: 'white' },
              ]}
            >
              Poslane
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'received' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('received')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'received' && { color: 'white' },
              ]}
            >
              Prejete
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'expenses' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('expenses')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'expenses' && { color: 'white' },
              ]}
            >
              Stroški
            </ThemedText>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    marginBottom: 12,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionRecipient: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  transactionGroup: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.6,
  },
});
