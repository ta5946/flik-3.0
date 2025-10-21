import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestMoneyScreen() {
  const colorScheme = useColorScheme();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const mockContacts = [
    { id: '1', name: 'ALJAŽ V.', phone: '+386 40 102 030' },
    { id: '2', name: 'MARTA K.', phone: '+386 41 234 567' },
    { id: '3', name: 'PETRA M.', phone: '+386 42 345 678' },
    { id: '4', name: 'MARKO L.', phone: '+386 43 456 789' },
  ];

  const handleRequest = () => {
    if (!amount || !recipient) {
      Alert.alert('Napaka', 'Prosimo, vnesite znesek in izberite prejemnika.');
      return;
    }

    Alert.alert(
      'Pošlji zahtevek',
      `Ali želite poslati zahtevek za ${amount} EUR ${recipient}?`,
      [
        { text: 'Prekliči', style: 'cancel' },
        { 
          text: 'Pošlji', 
          onPress: () => {
            Alert.alert('Uspeh', 'Zahtevek je bil poslan!');
            router.back();
          }
        },
      ]
    );
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setRecipient(contact.name);
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
            Zahtevaj denar
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Request Icon */}
        <View style={styles.requestIcon}>
          <IconSymbol name="plus" size={32} color={Colors[colorScheme ?? 'light'].primary} />
        </View>

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

        {/* Contact Selection */}
        <View style={styles.contactsSection}>
          <ThemedText style={styles.sectionTitle}>Izberite kontakt:</ThemedText>
          <View style={styles.contactsList}>
            {mockContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  selectedContact?.id === contact.id && { backgroundColor: Colors[colorScheme ?? 'light'].secondary },
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
        </View>

        {/* Request Summary */}
        {amount && recipient && (
          <View style={styles.requestSummary}>
            <ThemedText style={styles.summaryTitle}>Povzetek zahtevka:</ThemedText>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Prejemnik:</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                  {recipient}
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
            { backgroundColor: amount && recipient ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon },
          ]}
          onPress={handleRequest}
          disabled={!amount || !recipient}
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
  requestIcon: {
    alignItems: 'center',
    marginBottom: 30,
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
  contactsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  contactsList: {
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    opacity: 0.7,
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
