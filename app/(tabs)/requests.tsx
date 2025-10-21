import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PaymentRequest {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  currency: string;
  description: string;
  requester?: string;
  recipient?: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  groupName?: string;
}

const mockRequests: PaymentRequest[] = [
  {
    id: '1',
    type: 'incoming',
    amount: 15.75,
    currency: 'EUR',
    description: 'Za kino',
    requester: 'ALJAŽ V.',
    date: '2024-01-15',
    status: 'pending',
  },
  {
    id: '2',
    type: 'outgoing',
    amount: 45.30,
    currency: 'EUR',
    description: 'Za skupni obrok',
    recipient: 'MARTA K.',
    date: '2024-01-14',
    status: 'pending',
    groupName: 'Večerja',
  },
  {
    id: '3',
    type: 'incoming',
    amount: 87.25,
    currency: 'EUR',
    description: 'Hotelski račun',
    requester: 'PETRA M.',
    date: '2024-01-13',
    status: 'accepted',
    groupName: 'Potovanje v Italijo',
  },
  {
    id: '4',
    type: 'outgoing',
    amount: 12.50,
    currency: 'EUR',
    description: 'Za prevoz',
    recipient: 'MARKO L.',
    date: '2024-01-12',
    status: 'declined',
  },
];

export default function RequestsScreen() {
  const colorScheme = useColorScheme();
  const [requests] = useState<PaymentRequest[]>(mockRequests);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'pending'>('all');

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors[colorScheme ?? 'light'].warning;
      case 'accepted':
        return Colors[colorScheme ?? 'light'].success;
      case 'declined':
        return Colors[colorScheme ?? 'light'].error;
      case 'expired':
        return Colors[colorScheme ?? 'light'].icon;
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čaka na odgovor';
      case 'accepted':
        return 'Sprejeto';
      case 'declined':
        return 'Zavrnjeno';
      case 'expired':
        return 'Poteklo';
      default:
        return status;
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

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'incoming') return request.type === 'incoming';
    if (filter === 'outgoing') return request.type === 'outgoing';
    if (filter === 'pending') return request.status === 'pending';
    return true;
  });

  const renderRequest = (request: PaymentRequest) => (
    <TouchableOpacity
      key={request.id}
      style={[
        styles.requestCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestIcon}>
          <IconSymbol
            name={request.type === 'incoming' ? 'arrow.down.left' : 'arrow.up.right'}
            size={24}
            color={request.type === 'incoming' ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].primary}
          />
        </View>
        <View style={styles.requestInfo}>
          <ThemedText type="defaultSemiBold" style={styles.requestDescription}>
            {request.description}
          </ThemedText>
          {(request.requester || request.recipient) && (
            <ThemedText style={styles.requestPerson}>
              {request.type === 'incoming' ? `Od: ${request.requester}` : `Za: ${request.recipient}`}
            </ThemedText>
          )}
          {request.groupName && (
            <ThemedText style={styles.requestGroup}>
              {request.groupName}
            </ThemedText>
          )}
        </View>
        <View style={styles.requestAmount}>
          <ThemedText type="defaultSemiBold" style={styles.amountText}>
            {formatAmount(request.amount)}
          </ThemedText>
          <ThemedText style={styles.requestDate}>
            {formatDate(request.date)}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(request.status) }]} />
          <ThemedText style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {getStatusText(request.status)}
          </ThemedText>
        </View>
        
        {request.status === 'pending' && request.type === 'incoming' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.declineButton]}>
              <ThemedText style={styles.declineButtonText}>Zavrni</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
              <ThemedText style={styles.acceptButtonText}>Sprejmi</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Zahtevki
          </ThemedText>
          <TouchableOpacity style={styles.newRequestButton}>
            <IconSymbol name="plus" size={24} color={Colors[colorScheme ?? 'light'].primary} />
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
              Vsi
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'incoming' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('incoming')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'incoming' && { color: 'white' },
              ]}
            >
              Prejeti
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'outgoing' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('outgoing')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'outgoing' && { color: 'white' },
              ]}
            >
              Poslani
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'pending' && { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={() => setFilter('pending')}
          >
            <ThemedText
              style={[
                styles.filterTabText,
                filter === 'pending' && { color: 'white' },
              ]}
            >
              Čakajoči
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {filteredRequests.map(renderRequest)}
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
  newRequestButton: {
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
  requestsList: {
    marginBottom: 12,
  },
  requestCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  requestPerson: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  requestGroup: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  requestAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  declineButton: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  declineButtonText: {
    color: '#DC3545',
    fontSize: 12,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
  },
  acceptButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
});
