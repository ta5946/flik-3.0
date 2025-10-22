import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MOCK_MEMBERS, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { transactions, groups } = useGroups();
  const [balance] = useState(1250.75);
  const [currentLanguage, setCurrentLanguage] = useState('SI');
  
  // Force re-render when transactions change
  const [refreshKey, setRefreshKey] = useState(0);
  
  React.useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [transactions]);
  
  // Combine static pending requests with settle up transactions
  const staticPendingRequests = [
    { 
      id: 'p1', 
      name: 'ALJAŽ V.', 
      amount: 15.75, 
      description: 'Za kino', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minut nazaj
    },
    { 
      id: 'p2', 
      name: 'MARTA K.', 
      amount: 45.30, 
      description: 'Za skupni obrok', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 ura nazaj
    },
    { 
      id: 'p3', 
      name: 'PETRA M.', 
      amount: 25.00, 
      description: 'Za benzin', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 uri nazaj
    },
    { 
      id: 'p4', 
      name: 'MIHA M.', 
      amount: 12.50, 
      description: 'Za kavo', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 ure nazaj
    },
    { 
      id: 'p5', 
      name: 'ANA S.', 
      amount: 35.80, 
      description: 'Za kosilo', 
      type: 'incoming',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 ure nazaj
    },
    { 
      id: 'p6', 
      name: 'MARKO P.', 
      amount: 18.90, 
      description: 'Za parkiranje', 
      type: 'outgoing',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 ur nazaj
    },
  ];
  
  // Convert settle up transactions to pending requests format
  const settleUpRequests = transactions
    .filter(t => t.status === 'pending' && t.type === 'request')
    .map(t => {
      const group = groups.find(g => g.id === t.groupId);
      const fromMember = group?.members.find(m => m.id === t.fromUserId);
      const toMember = group?.members.find(m => m.id === t.toUserId);
      
      // For individual transactions, use MOCK_MEMBERS
      const fromMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.fromUserId) : fromMember;
      const toMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.toUserId) : toMember;
      
      // Check if Janez is the one who owes money (fromUserId) or is owed money (toUserId)
      const isJanezOwing = t.fromUserId === '1'; // Assuming Janez has ID '1'
      const isJanezOwed = t.toUserId === '1';
      
      return {
        id: t.id,
        name: isJanezOwing ? (toMemberIndividual?.name || 'Neznan uporabnik') : (fromMemberIndividual?.name || 'Neznan uporabnik'),
        amount: t.amount,
        description: t.description,
        type: isJanezOwing ? 'outgoing' as const : 'incoming' as const, // Janez owes = outgoing (red), Janez is owed = incoming (green)
        isSettleUp: t.groupId !== 'individual',
        isJanezOwing,
        isJanezOwed,
        createdAt: t.createdAt,
      };
    });
  
  const pendingRequests = [...staticPendingRequests, ...settleUpRequests];
  
  // Debug logging
  console.log('All transactions:', transactions);
  console.log('Settle up requests:', settleUpRequests);
  console.log('Pending requests:', pendingRequests);
  
  // Combine static recent transactions with completed settle up transactions
  const staticRecentTransactions = [
    { 
      id: '1', 
      name: 'ALJAŽ V.', 
      amount: 25.50, 
      description: 'Za kosilo', 
      type: 'sent',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 uri nazaj
    },
    { 
      id: '2', 
      name: 'MARTA K.', 
      amount: 45.30, 
      description: 'Sporočilo', 
      type: 'received',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 ur nazaj
    },
    { 
      id: '3', 
      name: 'PETRA M.', 
      amount: 87.25, 
      description: 'Hotelski račun', 
      type: 'expense', 
      group: 'Potovanje v Italijo',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 dan nazaj
    },
    { 
      id: '4', 
      name: 'MIHA M.', 
      amount: 15.75, 
      description: 'Za kino', 
      type: 'sent',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 dni nazaj
    },
    { 
      id: '5', 
      name: 'ANA S.', 
      amount: 32.40, 
      description: 'Za benzin', 
      type: 'received',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 dni nazaj
    },
    { 
      id: '6', 
      name: 'MARKO P.', 
      amount: 18.90, 
      description: 'Za parkiranje', 
      type: 'expense',
      group: 'Mestni izlet',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 dni nazaj
    },
    { 
      id: '7', 
      name: 'LARA T.', 
      amount: 55.60, 
      description: 'Za večerjo', 
      type: 'sent',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 dni nazaj
    },
  ];
  
  // Convert completed settle up transactions to recent transactions format
  const settleUpRecentTransactions = transactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .map(t => {
      const group = groups.find(g => g.id === t.groupId);
      const fromMember = group?.members.find(m => m.id === t.fromUserId);
      const toMember = group?.members.find(m => m.id === t.toUserId);
      
      // For individual transactions, use MOCK_MEMBERS
      const fromMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.fromUserId) : fromMember;
      const toMemberIndividual = t.groupId === 'individual' ? MOCK_MEMBERS.find(m => m.id === t.toUserId) : toMember;
      
      // Check if Janez was the one who paid (fromUserId) or received payment (toUserId)
      const isJanezPaid = t.fromUserId === '1'; // Janez paid someone
      const isJanezReceived = t.toUserId === '1'; // Janez received payment
      
      return {
        id: t.id,
        name: isJanezPaid ? (toMemberIndividual?.name || 'Neznan uporabnik') : (fromMemberIndividual?.name || 'Neznan uporabnik'),
        amount: t.amount,
        description: t.description,
        type: isJanezPaid ? 'sent' as const : 'received' as const, // Janez paid = sent (red), Janez received = received (green)
        group: t.groupId === 'individual' ? undefined : group?.name,
        isSettleUp: t.groupId !== 'individual',
        isJanezPaid,
        isJanezReceived,
        createdAt: t.createdAt,
      };
    });
  
  const recentTransactions = [...staticRecentTransactions, ...settleUpRecentTransactions];

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
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

  const getTransactionIcon = (type: string, group?: string, isSettleUp?: boolean, isJanezOwing?: boolean, isJanezPaid?: boolean) => {
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
    if (group) {
      return 'person.3.fill';
    }
    
    switch (type) {
      case 'sent':
        return 'arrow.up.right';
      case 'received':
        return 'arrow.down.left';
      case 'expense':
        return 'creditcard';
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
      case 'incoming':
        return '#28A745'; // Green for incoming/received
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView key={refreshKey} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoIcon}>
                  <IconSymbol name="creditcard.fill" size={24} color="white" />
                </View>
                <ThemedText style={styles.logoText}>Flik Pay</ThemedText>
              </View>
            </View>
            <View style={styles.languageSelector}>
              <ThemedText style={[
                styles.languageLabel,
                currentLanguage === 'SI' && styles.languageLabelActive
              ]}>SI</ThemedText>
              <TouchableOpacity 
                style={styles.languageSwitch}
                onPress={() => setCurrentLanguage(currentLanguage === 'SI' ? 'EN' : 'SI')}
              >
                <View style={[
                  styles.languageSwitchTrack,
                  currentLanguage === 'EN' && styles.languageSwitchTrackActive
                ]}>
                  <View style={[
                    styles.languageSwitchThumb,
                    currentLanguage === 'EN' && styles.languageSwitchThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
              <ThemedText style={[
                styles.languageLabel,
                currentLanguage === 'EN' && styles.languageLabelActive
              ]}>EN</ThemedText>
            </View>
          </View>
          
          <View style={styles.balanceCard}>
            <ThemedText style={styles.balanceLabel}>Stanje</ThemedText>
            <ThemedText type="title">
              {formatAmount(balance)}
            </ThemedText>
          </View>
        </View>

        {/* Quick Payment Actions */}
        <View style={styles.quickPaymentSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Hitra plačila
          </ThemedText>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButtonPrimary}
              onPress={() => router.push('/qr-scanner')}
            >
              <IconSymbol name="qrcode" size={28} color="white" />
              <ThemedText style={styles.actionButtonText}>Skeniraj QR</ThemedText>
            </TouchableOpacity>
            
            <Link href="/send-money" asChild>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <IconSymbol name="arrow.up.right" size={28} color="white" />
                <ThemedText style={styles.actionButtonText}>Pošlji</ThemedText>
              </TouchableOpacity>
            </Link>
            
            <Link href="/request-money" asChild>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <IconSymbol name="arrow.down.left" size={28} color="white" />
                <ThemedText style={styles.actionButtonText}>Zahtevaj</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.pendingRequests}>
            <View style={styles.pendingHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Čakajoči zahtevki ({pendingRequests.length})
              </ThemedText>
              <Link href="/transactions?filter=pending" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.seeAllText}>Prikaži vse</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
            
            {pendingRequests.slice(0, 5).map((request) => (
              <TouchableOpacity key={request.id} style={styles.requestItem}>
                <View style={styles.transactionIcon}>
                  <IconSymbol
                  name={getTransactionIcon(request.type, undefined, (request as any).isSettleUp, (request as any).isJanezOwing)}
                    size={20}
                    color={getTransactionColor(request.type)}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.transactionName}>
                    {request.name}
                  </ThemedText>
                  <ThemedText style={styles.transactionDescription}>
                    {request.description}
                  </ThemedText>
                  {(request as any).createdAt && (
                    <ThemedText style={styles.transactionTime}>
                      {formatSlovenianDate((request as any).createdAt)}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.requestActions}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(request.type) },
                    ]}
                  >
                    {request.type === 'incoming' ? '+' : '-'}{formatAmount(request.amount)}
                  </ThemedText>
                  {request.type === 'outgoing' && (
                    <View style={styles.requestButtons}>
                      <TouchableOpacity style={styles.requestPayButton}>
                        <ThemedText style={styles.requestPayButtonText}>Plačaj</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {request.type === 'incoming' && (
                    <View style={styles.requestButtons}>
                      <TouchableOpacity style={styles.remindButton}>
                        <ThemedText style={styles.remindButtonText}>Opomni</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.recentTransactions}>
          <View style={styles.recentHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Zadnje transakcije
            </ThemedText>
            <Link href="/transactions?filter=completed" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>Prikaži vse</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          
          {recentTransactions.slice(0, 5).map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <IconSymbol
                  name={getTransactionIcon(transaction.type, transaction.group, (transaction as any).isSettleUp, undefined, (transaction as any).isJanezPaid)}
                  size={20}
                  color={getTransactionColor(transaction.type)}
                />
              </View>
              <View style={styles.transactionInfo}>
                <ThemedText type="defaultSemiBold" style={styles.transactionName}>
                  {transaction.name}
                </ThemedText>
                <ThemedText style={styles.transactionDescription}>
                  {transaction.description}
                </ThemedText>
                {transaction.group && (
                  <ThemedText style={styles.transactionGroup}>
                    {transaction.group}
                  </ThemedText>
                )}
                {(transaction as any).createdAt && (
                  <ThemedText style={styles.transactionTime}>
                    {formatSlovenianDate((transaction as any).createdAt)}
                  </ThemedText>
                )}
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type) },
                ]}
              >
                {transaction.type === 'sent' || transaction.type === 'expense' ? '-' : '+'}
                {formatAmount(transaction.amount)}
              </ThemedText>
            </TouchableOpacity>
          ))}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#1e40af', // Flik Pay blue
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
  },
  languageLabelActive: {
    color: 'white',
    fontWeight: '700',
  },
  languageSwitch: {
    alignItems: 'center',
  },
  languageSwitchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
  },
  languageSwitchTrackActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  languageSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    marginLeft: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  languageSwitchThumbActive: {
    marginLeft: 22,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -1,
  },
  quickPaymentSection: {
    margin: 20,
    marginTop: -10,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#1e40af', // Flik Pay blue
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  recentTransactions: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  pendingRequests: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  pendingHeader: {
    marginBottom: 20,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  requestActions: {
    alignItems: 'flex-end',
  },
  requestButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  requestPayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  requestPayButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  remindButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  remindButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: '#1e40af', // Flik Pay blue
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1e293b',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  transactionGroup: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  transactionTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
