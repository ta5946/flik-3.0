import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SendMoneyScreen() {
  const colorScheme = useColorScheme();
  const [amount, setAmount] = useState('7,20');
  const [message, setMessage] = useState('Za kosilo.');
  const [recipient] = useState({
    name: 'ALJAŽ V.',
    phone: '+386 40 102 030',
  });

  const handleSend = () => {
    Alert.alert(
      'Potrditev plačila',
      `Ali želite poslati ${amount} EUR ${recipient.name}?`,
      [
        { text: 'Prekliči', style: 'cancel' },
        { 
          text: 'Pošlji', 
          onPress: () => {
            // Navigate to confirmation screen
            router.push('/payment-confirmation');
          }
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Pošlji
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Recipient Info */}
        <View style={styles.recipientSection}>
          <View style={styles.recipientIcon}>
            <IconSymbol name="arrow.up.right" size={32} color={Colors[colorScheme ?? 'light'].primary} />
          </View>
          <View style={styles.recipientInfo}>
            <ThemedText type="subtitle" style={styles.recipientName}>
              {recipient.name}
            </ThemedText>
            <ThemedText style={styles.recipientPhone}>
              {recipient.phone}
            </ThemedText>
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.paymentForm}>
          <View style={styles.inputCard}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Vnesite znesek:</ThemedText>
              <TextInput
                style={[styles.amountInput, { color: Colors[colorScheme ?? 'light'].primary }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Sporočilo:</ThemedText>
              <TextInput
                style={[styles.messageInput, { color: Colors[colorScheme ?? 'light'].text }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Vnesite sporočilo..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmounts}>
          <ThemedText style={styles.quickAmountsTitle}>Hitri zneski:</ThemedText>
          <View style={styles.quickAmountButtons}>
            {['5,00', '10,00', '25,00', '50,00'].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[styles.quickAmountButton, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}
                onPress={() => setAmount(quickAmount)}
              >
                <ThemedText style={[styles.quickAmountText, { color: Colors[colorScheme ?? 'light'].primary }]}>
                  {quickAmount} EUR
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Prejemnik:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
              {recipient.name}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Znesek:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
              {amount} EUR
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Provizija:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
              0,00 EUR
            </ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText type="defaultSemiBold" style={styles.totalLabel}>Skupaj:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.totalValue}>
              {amount} EUR
            </ThemedText>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
          onPress={handleSend}
        >
          <ThemedText style={styles.sendButtonText}>POŠLJI</ThemedText>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <IconSymbol name="lock.shield" size={16} color={Colors[colorScheme ?? 'light'].success} />
          <ThemedText style={styles.securityText}>
            Vaša transakcija je zavarovana z bankovno enkripcijo
          </ThemedText>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  recipientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    marginBottom: 24,
  },
  recipientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipientPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  paymentForm: {
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
    paddingVertical: 8,
  },
  messageInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 8,
    minHeight: 40,
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentSummary: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 18,
    color: '#0066CC',
  },
  sendButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    opacity: 0.7,
    color: '#28A745',
    marginLeft: 8,
  },
});
