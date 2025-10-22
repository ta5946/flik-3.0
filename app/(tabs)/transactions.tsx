import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MOCK_MEMBERS, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'expense' | 'settlement' | 'incoming' | 'outgoing';
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  groupName?: string;
  category: string;
  isSettleUp?: boolean;
  isJanezOwing?: boolean;
  isJanezOwed?: boolean;
  isJanezPaid?: boolean;
  isJanezReceived?: boolean;
  createdAt?: string;
}

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const { transactions: settleUpTransactions, groups } = useGroups();
  const { filter } = useLocalSearchParams();
  const [directionFilter, setDirectionFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'group'>('all');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  // Set initial filters based on URL params
  useEffect(() => {
    if (filter === 'pending') {
      setShowPendingOnly(true);
      setShowCompletedOnly(false);
    } else if (filter === 'completed') {
      setShowPendingOnly(false);
      setShowCompletedOnly(true);
    } else {
      setShowPendingOnly(false);
      setShowCompletedOnly(false);
    }
  }, [filter]);

  // Static test data
  const staticPendingRequests = [
    { 
      id: 'p1', 
      name: 'ALJAŽ V.', 
      amount: 15.75, 
      description: 'Za kino', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    { 
      id: 'p2', 
      name: 'MARTA K.', 
      amount: 45.30, 
      description: 'Za skupni obrok', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 'p3', 
      name: 'PETRA M.', 
      amount: 25.00, 
      description: 'Za benzin', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 'p4', 
      name: 'MIHA M.', 
      amount: 12.50, 
      description: 'Za kavo', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 'p5', 
      name: 'ANA S.', 
      amount: 35.80, 
      description: 'Za kosilo', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 'p6', 
      name: 'MARKO P.', 
      amount: 18.90, 
      description: 'Za parkiranje', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
  ];

  const staticRecentTransactions = [
    { 
      id: '1', 
      name: 'ALJAŽ V.', 
      amount: 25.50, 
      description: 'Za kosilo', 
      type: 'sent',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '2', 
      name: 'MARTA K.', 
      amount: 45.30, 
      description: 'Sporočilo', 
      type: 'received',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '3', 
      name: 'PETRA M.', 
      amount: 87.25, 
      description: 'Hotelski račun', 
      type: 'expense', 
      groupName: 'Potovanje v Italijo',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '4', 
      name: 'MIHA M.', 
      amount: 15.75, 
      description: 'Za kino', 
      type: 'sent',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '5', 
      name: 'ANA S.', 
      amount: 32.40, 
      description: 'Za benzin', 
      type: 'received',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '6', 
      name: 'MARKO P.', 
      amount: 18.90, 
      description: 'Za parkiranje', 
      type: 'expense',
      groupName: 'Mestni izlet',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: '7', 
      name: 'LARA T.', 
      amount: 55.60, 
      description: 'Za večerjo', 
      type: 'sent',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
  ];

  // Convert settle up transactions to pending requests format
  const settleUpRequests = settleUpTransactions
    .filter(t => t.status === 'pending' && t.type === 'request')
    .map(t => {
      const group = groups.find(g => g.id === t.groupId);
      const fromMember = group?.members.find(m => m.id === t.fromUserId);
      const toMember = group?.members.find(m => m.id === t.toUserId);
      
      // For individual transactions, use MOCK_MEMBERS
      const fromMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.fromUserId) : fromMember;
      const toMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.toUserId) : toMember;
      
      const isJanezOwing = t.fromUserId === '1';
      const isJanezOwed = t.toUserId === '1';
      
      return {
        id: t.id,
        name: isJanezOwing ? (toMemberIndividual?.name || 'Neznan uporabnik') : (fromMemberIndividual?.name || 'Neznan uporabnik'),
        amount: t.amount,
        description: t.description,
        type: isJanezOwing ? 'outgoing' as const : 'incoming' as const,
        isSettleUp: t.groupId !== 'individual',
        isJanezOwing,
        isJanezOwed,
        createdAt: t.createdAt,
      };
    });

  // Convert completed settle up transactions to recent transactions format
  const settleUpRecentTransactions = settleUpTransactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .map(t => {
      const group = groups.find(g => g.id === t.groupId);
      const fromMember = group?.members.find(m => m.id === t.fromUserId);
      const toMember = group?.members.find(m => m.id === t.toUserId);
      
      // For individual transactions, use MOCK_MEMBERS
      const fromMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.fromUserId) : fromMember;
      const toMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.toUserId) : toMember;
      
      const isJanezPaid = t.fromUserId === '1';
      const isJanezReceived = t.toUserId === '1';
      
      return {
        id: t.id,
        name: isJanezPaid ? (toMemberIndividual?.name || 'Neznan uporabnik') : (fromMemberIndividual?.name || 'Neznan uporabnik'),
        amount: t.amount,
        description: t.description,
        type: isJanezPaid ? 'sent' as const : 'received' as const,
        groupName: t.groupId === 'individual' ? undefined : group?.name,
        isSettleUp: t.groupId !== 'individual',
        isJanezPaid,
        isJanezReceived,
        createdAt: t.createdAt,
      };
    });

  // Combine all transactions
  const allPendingRequests = [...staticPendingRequests, ...settleUpRequests];
  const allRecentTransactions = [...staticRecentTransactions, ...settleUpRecentTransactions];
  const allTransactions = [...allPendingRequests, ...allRecentTransactions];
  
  // Debug logging
  console.log('Transactions page - All transactions:', settleUpTransactions);
  console.log('Transactions page - Settle up requests:', settleUpRequests);
  console.log('Transactions page - All pending requests:', allPendingRequests);

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'sent' || type === 'expense' || type === 'outgoing' ? '-' : '+';
    return `${sign}${amount.toFixed(2)} EUR`;
  };

  const getTransactionIcon = (type: string, groupName?: string, isSettleUp?: boolean, isJanezOwing?: boolean, isJanezPaid?: boolean) => {
    // Use settle up icon if it's a settle up transaction
    if (isSettleUp) {
      if (isJanezOwing !== undefined) {
        return isJanezOwing ? 'arrow.up.right' : 'arrow.down.left'; // For pending requests
      }
      if (isJanezPaid !== undefined) {
        return isJanezPaid ? 'arrow.up.right' : 'arrow.down.left'; // For recent transactions
      }
      return 'checkmark.circle'; // Fallback
    }
    
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
      case 'incoming':
        return 'arrow.down.left';
      case 'outgoing':
        return 'arrow.up.right';
      default:
        return 'circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sent':
      case 'expense':
      case 'outgoing':
        return '#DC3545'; // Red for outgoing/sent
      case 'received':
      case 'settlement':
      case 'incoming':
        return '#28A745'; // Green for incoming/received
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  const formatSlovenianDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = allTransactions.filter(transaction => {
    // Pending/Completed filter
    const statusMatch = showPendingOnly ? 
      (transaction.type === 'incoming' || transaction.type === 'outgoing') :
      showCompletedOnly ?
      (transaction.type === 'sent' || transaction.type === 'received' || transaction.type === 'expense') :
      true; // Show all if no specific filter
    
    // Direction filter
    const directionMatch = directionFilter === 'all' || 
      (directionFilter === 'sent' && (transaction.type === 'sent' || transaction.type === 'outgoing')) ||
      (directionFilter === 'received' && (transaction.type === 'received' || transaction.type === 'incoming'));
    
    // Type filter
    const typeMatch = typeFilter === 'all' ||
      (typeFilter === 'individual' && !transaction.groupName) ||
      (typeFilter === 'group' && transaction.groupName);
    
    return statusMatch && directionMatch && typeMatch;
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
            name={getTransactionIcon(transaction.type, transaction.groupName, (transaction as any).isSettleUp, (transaction as any).isJanezOwing, (transaction as any).isJanezPaid)}
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
          {(transaction as any).createdAt && (
            <ThemedText style={styles.transactionTime}>
              {formatSlovenianDate((transaction as any).createdAt)}
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
          {/* Show action buttons for pending requests */}
          {(transaction.type === 'incoming' || transaction.type === 'outgoing') && (
            <View style={styles.requestActions}>
              {transaction.type === 'outgoing' && (
                <TouchableOpacity style={styles.requestPayButton}>
                  <ThemedText style={styles.requestPayButtonText}>Plačaj</ThemedText>
                </TouchableOpacity>
              )}
              {transaction.type === 'incoming' && (
                <TouchableOpacity style={styles.remindButton}>
                  <ThemedText style={styles.remindButtonText}>Opomni</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <IconSymbol name="creditcard.fill" size={24} color="white" />
              </View>
              <ThemedText type="title" style={styles.headerTitle}>
                {showPendingOnly ? 'Čakajoči zahtevki' : showCompletedOnly ? 'Zadnje transakcije' : 'Transakcije'}
              </ThemedText>
            </View>
            <ThemedText style={styles.headerSubtitle}>
              {showPendingOnly ? 'Vaši čakajoči zahtevki' : showCompletedOnly ? 'Zgodovina transakcij' : 'Vse transakcije'}
            </ThemedText>
          </View>
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
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
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  filterRow: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  transactionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
  transactionTime: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 2,
  },
  requestActions: {
    marginTop: 4,
  },
  requestPayButton: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  requestPayButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  remindButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  remindButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
