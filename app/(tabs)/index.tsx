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
  const [recentTransactions] = useState([
    { id: '1', name: 'ALJAŽ V.', amount: 25.50, description: 'Za kosilo', type: 'sent' },
    { id: '2', name: 'MARTA K.', amount: 45.30, description: 'Sporočilo', type: 'received' },
    { id: '3', name: 'PETRA M.', amount: 87.25, description: 'Hotelski račun', type: 'expense', group: 'Potovanje v Italijo' },
  ]);

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return 'arrow.up.right';
      case 'received':
        return 'arrow.down.left';
      case 'expense':
        return 'creditcard';
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
        return Colors[colorScheme ?? 'light'].success;
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
                <IconSymbol name="plus" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>Zahtevaj</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Group Actions */}
        <View style={styles.groupActions}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Skupine in proračuni
          </ThemedText>
          
          <View style={styles.groupButtons}>
            <Link href="/groups" asChild>
              <TouchableOpacity style={styles.groupButtonSecondary}>
                <IconSymbol name="person.3" size={20} color="#0066CC" />
                <ThemedText style={styles.groupButtonTextSecondary}>
                  Skupine
                </ThemedText>
              </TouchableOpacity>
            </Link>
            
            <TouchableOpacity style={styles.groupButtonSecondary}>
              <IconSymbol name="chart.bar" size={20} color="#0066CC" />
              <ThemedText style={styles.groupButtonTextSecondary}>
                Proračuni
              </ThemedText>
            </TouchableOpacity>
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
                  name={getTransactionIcon(transaction.type)}
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
    paddingTop: 60,
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
  groupActions: {
    marginBottom: 24,
  },
  groupButtons: {
    flexDirection: 'row',
  },
  groupButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  groupButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#E6F4FE',
  },
  groupButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  groupButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    marginBottom: 2,
  },
  transactionDescription: {
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
    fontSize: 16,
    fontWeight: '600',
  },
});
