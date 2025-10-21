import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [balance] = useState(1250.75);
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
              <ThemedText style={styles.logoText}>flik</ThemedText>
            </View>
            <View style={styles.languageSelector}>
              <TouchableOpacity style={styles.languageButton}>
                <ThemedText style={styles.languageText}>SI</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageButton}>
                <ThemedText style={styles.languageText}>EN</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.balanceCard}>
            <ThemedText style={styles.balanceLabel}>Stanje</ThemedText>
            <ThemedText type="title" style={styles.balanceAmount}>
              {formatAmount(balance)}
            </ThemedText>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.mainActions}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Hitra plačila
          </ThemedText>
          
          <View style={styles.actionButtons}>
            <Link href="/send-money" asChild>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <IconSymbol name="creditcard" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>Plačaj</ThemedText>
              </TouchableOpacity>
            </Link>
            
            <Link href="/send-money" asChild>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <IconSymbol name="arrow.up.right" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>Pošlji</ThemedText>
              </TouchableOpacity>
            </Link>
            
            <Link href="/request-money" asChild>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <IconSymbol name="arrow.down.left" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>Zahtevaj</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Quick Payment Instructions */}
        <View style={styles.instructionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Začni z uporabo Flik Pay aplikacije
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            Na POS terminalu brezstično skenirajte QR kodo ali prislonite telefon z vklopljenim NFC-jem.
          </ThemedText>
          <TouchableOpacity style={styles.payButtonPrimary}>
            <ThemedText style={styles.payButtonText}>PLAČAJ</ThemedText>
          </TouchableOpacity>
          <View style={styles.dots}>
            <View style={styles.dotPrimary} />
            <View style={styles.dotSecondary} />
            <View style={styles.dotSecondary} />
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.pendingRequests}>
            <View style={styles.pendingHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Čakajoči zahtevki
              </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>Vse</ThemedText>
              </TouchableOpacity>
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
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: '#E6F4FE',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  mainActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#0066CC',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  payButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonPrimary: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#0066CC',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotPrimary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#0066CC',
  },
  dotSecondary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#687076',
  },
  recentTransactions: {
    marginBottom: 24,
  },
  pendingRequests: {
    marginBottom: 24,
  },
  pendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  requestPayButtonText: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '500',
  },
  remindButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  remindButtonText: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '500',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
