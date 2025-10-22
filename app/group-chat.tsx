import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';


export default function GroupChatScreen() {
  const colorScheme = useColorScheme();
  const { getGroupById, addMessage, getMessagesByGroup } = useGroups();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const groupData = getGroupById(groupId || '1');

  // Load messages from context
  useEffect(() => {
    if (groupData) {
      const groupMessages = getMessagesByGroup(groupData.id);
      setMessages(groupMessages);
    }
  }, [groupData, getMessagesByGroup]);

  if (!groupData) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Skupina ni najdena
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim() || !groupData) return;

    addMessage({
      groupId: groupData.id,
      senderId: '1', // Current user
      senderName: 'Janez Novak',
      message: messageText.trim(),
      type: 'text'
    });

    // Refresh messages
    const updatedMessages = getMessagesByGroup(groupData.id);
    setMessages(updatedMessages);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sl-SI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.senderId === '1';
    
    return (
      <ChatMessage
        key={message.id}
        message={message}
        isCurrentUser={isCurrentUser}
        onReply={(msg) => {
          // Handle reply functionality
          console.log('Reply to:', msg.message);
        }}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <ThemedText type="title" style={styles.headerTitle}>
              {groupData.name}
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {groupData.members.length} članov
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol name="ellipsis" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onAttachImage={() => {
            console.log('Attach image');
          }}
          placeholder="Napišite sporočilo..."
          maxLength={500}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
});