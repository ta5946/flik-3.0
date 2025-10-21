import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [balance] = useState(1250.75);
  const [currentLanguage, setCurrentLanguage] = useState('SI');
  const [pendingRequests] = useState([
    { id: 'p1', name: 'ALJAŽ V.', amount: 15.75, description: 'Za kino', type: 'incoming' },
    { id: 'p2', name: 'MARTA K.', amount: 45.30, description: 'Za skupni obrok', type: 'outgoing' },
  ]);
  const [recentTransactions] = useState([
    { id: '1', name: 'ALJAŽ V.', amount: 25.50, description: 'Za kosilo', type: 'sent' },
    { id: '2', name: 'MARTA K.', amount: 45.30, description: 'Sporočilo', type: 'received' },
    { id: '3', name: 'PETRA M.', amount: 87.25, description: 'Hotelski račun', type: 'expense', group: 'Potovanje v Italijo' },
  ]);

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getTransactionIcon = (type: string, group?: string) => {
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <ThemedText style={styles.logoText}>flik™</ThemedText>
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
            <ThemedText type="title" style={styles.balanceAmount}>
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
                Čakajoči zahtevki
              </ThemedText>
            </View>
            
            {pendingRequests.map((request) => (
              <TouchableOpacity key={request.id} style={styles.requestItem}>
                <View style={styles.transactionIcon}>
                  <IconSymbol
                    name={getTransactionIcon(request.type)}
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
                  {request.type === 'incoming' && (
                    <View style={styles.requestButtons}>
                      <TouchableOpacity style={styles.requestPayButton}>
                        <ThemedText style={styles.requestPayButtonText}>Plačaj</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {request.type === 'outgoing' && (
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
            <Link href="/transactions" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>Prikaži vse</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          
          {recentTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <IconSymbol
                  name={getTransactionIcon(transaction.type, transaction.group)}
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
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
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.5)',
    marginHorizontal: 8,
  },
  languageLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  languageSwitch: {
    alignItems: 'center',
  },
  languageSwitchTrack: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
  },
  languageSwitchTrackActive: {
    backgroundColor: '#007AFF',
  },
  languageSwitchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginLeft: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  languageSwitchThumbActive: {
    marginLeft: 22,
  },
  balanceCard: {
    backgroundColor: 'rgba(0,122,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.1)',
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '600',
    color: '#007AFF',
  },
  quickPaymentSection: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginHorizontal: 6,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  recentTransactions: {
    marginBottom: 20,
  },
  pendingRequests: {
    marginBottom: 20,
  },
  pendingHeader: {
    marginBottom: 12,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  requestActions: {
    alignItems: 'flex-end',
  },
  requestButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  requestPayButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  requestPayButtonText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  remindButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  remindButtonText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 8,
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
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  transactionDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 1,
  },
  transactionGroup: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
