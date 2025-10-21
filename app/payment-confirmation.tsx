import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PaymentConfirmationScreen() {
  const colorScheme = useColorScheme();
  
  const transactionData = {
    recipient: 'ALJAŽ V.',
    amount: '7,20 EUR',
    date: '08.09.2023 11:23',
    reference: 'FLK202409081123456',
  };

  const handleClose = () => {
    router.push('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Plačilo izvedeno
          </ThemedText>
          <ThemedText style={styles.transactionDate}>
            {transactionData.date}
          </ThemedText>
        </View>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <View style={[styles.iconCircle, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
            <IconSymbol name="checkmark" size={48} color="white" />
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          <View style={styles.recipientCard}>
            <ThemedText type="subtitle" style={styles.recipientName}>
              {transactionData.recipient}
            </ThemedText>
          </View>
          
          <View style={styles.amountCard}>
            <ThemedText style={styles.amountLabel}>Znesek:</ThemedText>
            <ThemedText type="title" style={styles.amountValue}>
              {transactionData.amount}
            </ThemedText>
          </View>

          <View style={styles.referenceCard}>
            <ThemedText style={styles.referenceLabel}>Referenčna številka:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.referenceValue}>
              {transactionData.reference}
            </ThemedText>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <IconSymbol name="clock" size={16} color={Colors[colorScheme ?? 'light'].icon} />
            <ThemedText style={styles.infoText}>
              Transakcija je bila izvedena takoj
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="shield.checkered" size={16} color={Colors[colorScheme ?? 'light'].success} />
            <ThemedText style={styles.infoText}>
              Plačilo je varno in zavarovano
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="bell" size={16} color={Colors[colorScheme ?? 'light'].icon} />
            <ThemedText style={styles.infoText}>
              Prejemnik je bil obveščen
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton}>
            <IconSymbol name="square.and.arrow.up" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.shareButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Deli
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.receiptButton}>
            <IconSymbol name="doc.text" size={20} color={Colors[colorScheme ?? 'light'].primary} />
            <ThemedText style={[styles.receiptButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>
              Potrdilo
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
          onPress={handleClose}
        >
          <ThemedText style={styles.closeButtonText}>ZAPRI</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 16,
    opacity: 0.7,
  },
  successIcon: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    width: '100%',
    marginBottom: 40,
  },
  recipientCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  recipientName: {
    fontSize: 20,
    fontWeight: '600',
  },
  amountCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  referenceCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  referenceLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  additionalInfo: {
    width: '100%',
    marginBottom: 40,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    marginLeft: 8,
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
