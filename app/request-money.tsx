import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MOCK_MEMBERS, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestMoneyScreen() {
  const colorScheme = useColorScheme();
  const { addTransaction } = useGroups();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactList, setShowContactList] = useState(false);

  const handleRequest = () => {
    if (!amount || !selectedContact) {
      Alert.alert('Napaka', 'Prosimo, vnesite znesek in izberite prejemnika.');
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Napaka', 'Prosimo, vnesite veljaven znesek.');
      return;
    }

    Alert.alert(
      'Pošlji zahtevek',
      `Ali želite poslati zahtevek za ${amount} EUR ${selectedContact.name}?`,
      [
        { text: 'Prekliči', style: 'cancel' },
        { 
          text: 'Pošlji', 
          onPress: () => {
            // Create individual request transaction
            const transactionData = {
              groupId: 'individual', // Special group ID for individual transactions
              fromUserId: selectedContact.id, // The person who should pay
              toUserId: '1', // Janez is the one requesting
              amount: amountValue,
              type: 'request' as const,
              status: 'pending' as const,
              description: message || `Zahtevek za ${selectedContact.name}`,
            };
            
            console.log('Creating request transaction:', transactionData);
            addTransaction(transactionData);
            
            Alert.alert('Uspeh', 'Zahtevek je bil poslan!');
            router.back();
          }
        },
      ]
    );
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setShowContactList(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <IconSymbol name="creditcard.fill" size={20} color="white" />
              </View>
              <ThemedText type="subtitle" style={styles.headerTitle}>
                Zahtevaj denar
              </ThemedText>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Recipient Selection */}
        <View style={styles.recipientSection}>
          <TouchableOpacity 
            style={styles.recipientSelector}
            onPress={() => setShowContactList(!showContactList)}
          >
            <View style={styles.recipientIcon}>
              <IconSymbol name="arrow.down.left" size={32} color={Colors[colorScheme ?? 'light'].primary} />
            </View>
            <View style={styles.recipientInfo}>
              {selectedContact ? (
                <>
                  <ThemedText type="subtitle" style={styles.recipientName}>
                    {selectedContact.name}
                  </ThemedText>
                  <ThemedText style={styles.recipientPhone}>
                    {selectedContact.phone}
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText type="subtitle" style={styles.recipientName}>
                    Izberite prejemnika
                  </ThemedText>
                  <ThemedText style={styles.recipientPhone}>
                    Tapnite za izbiro
                  </ThemedText>
                </>
              )}
            </View>
            <IconSymbol 
              name={showContactList ? "chevron.up" : "chevron.down"} 
              size={20} 
              color={Colors[colorScheme ?? 'light'].icon} 
            />
          </TouchableOpacity>
        </View>

        {/* Contact List */}
        {showContactList && (
          <View style={styles.contactList}>
            {MOCK_MEMBERS.filter(member => member.id !== '1').map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  selectedContact?.id === contact.id && { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#1e40af' },
                ]}
                onPress={() => selectContact(contact)}
              >
                <View style={styles.contactAvatar}>
                  <ThemedText style={styles.contactInitial}>
                    {contact.name.charAt(0)}
                  </ThemedText>
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.contactName}>
                    {contact.name}
                  </ThemedText>
                  <ThemedText style={styles.contactPhone}>
                    {contact.phone}
                  </ThemedText>
                </View>
                {selectedContact?.id === contact.id && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>Znesek:</ThemedText>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={[styles.amountInput, { color: Colors[colorScheme ?? 'light'].text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            />
            <ThemedText style={styles.currencyText}>EUR</ThemedText>
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
                  {quickAmount}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.messageSection}>
          <ThemedText style={styles.inputLabel}>Sporočilo (opcijsko):</ThemedText>
          <TextInput
            style={[styles.messageInput, { color: Colors[colorScheme ?? 'light'].text }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Dodajte sporočilo..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            multiline
          />
        </View>


        {/* Request Summary */}
        {amount && selectedContact && (
          <View style={styles.requestSummary}>
            <ThemedText style={styles.summaryTitle}>Povzetek zahtevka:</ThemedText>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Prejemnik:</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                  {selectedContact.name}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Znesek:</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                  {amount} EUR
                </ThemedText>
              </View>
              {message && (
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Sporočilo:</ThemedText>
                  <ThemedText style={styles.summaryValue}>
                    {message}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Send Request Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: amount && selectedContact ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon },
          ]}
          onPress={handleRequest}
          disabled={!amount || !selectedContact}
        >
          <ThemedText style={styles.sendButtonText}>POŠLJI ZAHTEVEK</ThemedText>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <IconSymbol name="lock.shield" size={16} color={Colors[colorScheme ?? 'light'].success} />
          <ThemedText style={styles.securityText}>
            Zahtevek bo poslan preko varnih FLIK kanalov
          </ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#1e40af', // Flik Pay blue
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  recipientSection: {
    marginBottom: 24,
  },
  recipientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
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
  contactList: {
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactName: {
    fontSize: 16,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    opacity: 0.7,
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
  messageSection: {
    marginBottom: 24,
  },
  messageInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestSummary: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
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
