import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ChatMessage, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { getGroupById, getMessagesByGroup, addMessage } = useGroups();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const group = groupId ? getGroupById(groupId) : null;

  useEffect(() => {
    if (groupId) {
      const groupMessages = getMessagesByGroup(groupId);
      setMessages(groupMessages);
    }
  }, [groupId, getMessagesByGroup]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !groupId || !group) return;

    const currentUser = group.members[0]; // Assuming first member is current user
    
    addMessage({
      groupId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: messageText.trim(),
      type: 'text',
    });

    setMessageText('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sl-SI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Danes';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Včeraj';
    } else {
      return date.toLocaleDateString('sl-SI', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const shouldShowDate = (message: ChatMessage, previousMessage?: ChatMessage) => {
    if (!previousMessage) return true;
    
    const messageDate = new Date(message.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return messageDate !== previousDate;
  };

  const shouldShowAvatar = (message: ChatMessage, previousMessage?: ChatMessage) => {
    if (!previousMessage) return true;
    
    const timeDiff = new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    
    return message.senderId !== previousMessage.senderId || timeDiff > fiveMinutes;
  };

  if (!group) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle">Skupina ni najdena</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <ThemedText type="subtitle" style={styles.groupName}>{group.name}</ThemedText>
          <ThemedText style={styles.memberCount}>
            {group.members.length} članov
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <IconSymbol name="info.circle" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol 
              name="bubble.left.and.bubble.right" 
              size={48} 
              color={Colors[colorScheme ?? 'light'].icon} 
            />
            <ThemedText style={styles.emptyStateText}>
              Začnite pogovor s skupino!
            </ThemedText>
          </View>
        ) : (
          messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : undefined;
            const showDate = shouldShowDate(message, previousMessage);
            const showAvatar = shouldShowAvatar(message, previousMessage);
            const isCurrentUser = message.senderId === group.members[0].id;
            const isSystemMessage = message.type === 'system' || message.type === 'expense';

            return (
              <View key={message.id}>
                {showDate && (
                  <View style={styles.dateSeparator}>
                    <ThemedText style={styles.dateText}>
                      {formatDate(message.timestamp)}
                    </ThemedText>
                  </View>
                )}
                
                {isSystemMessage ? (
                  <View style={styles.systemMessageContainer}>
                    <View style={styles.systemMessageBubble}>
                      <ThemedText style={styles.systemMessageText}>
                        {message.content}
                      </ThemedText>
                      <ThemedText style={styles.systemMessageTime}>
                        {formatTime(message.timestamp)}
                      </ThemedText>
                    </View>
                  </View>
                ) : (
                  <View style={[
                    styles.messageContainer,
                    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
                  ]}>
                    {!isCurrentUser && showAvatar && (
                      <View style={[styles.avatar, { backgroundColor: group.color }]}>
                        <ThemedText style={styles.avatarText}>
                          {message.senderName.charAt(0)}
                        </ThemedText>
                      </View>
                    )}
                    
                    <View style={[
                      styles.messageBubble,
                      isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                      { backgroundColor: isCurrentUser ? '#007AFF' : '#007AFF' }
                    ]}>
                      {!isCurrentUser && showAvatar && (
                        <ThemedText style={styles.senderName}>
                          {message.senderName}
                        </ThemedText>
                      )}
                      
                      <ThemedText style={[
                        styles.messageText,
                        isCurrentUser ? styles.currentUserText : styles.otherUserText
                      ]}>
                        {message.content}
                      </ThemedText>
                      
                      <ThemedText style={[
                        styles.messageTime,
                        isCurrentUser ? styles.currentUserTime : styles.otherUserTime
                      ]}>
                        {formatTime(message.timestamp)}
                      </ThemedText>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].text }]}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Napišite sporočilo..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={handleSendMessage}
            style={[
              styles.sendButton,
              { backgroundColor: messageText.trim() ? group.color : Colors[colorScheme ?? 'light'].icon }
            ]}
            disabled={!messageText.trim()}
          >
            <IconSymbol 
              name="arrow.up" 
              size={20} 
              color={messageText.trim() ? '#FFFFFF' : Colors[colorScheme ?? 'light'].background} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  groupName: {
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  infoButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-end',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    opacity: 0.8,
    color: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
  },
  currentUserTime: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  otherUserTime: {
    color: '#FFFFFF',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageBubble: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '80%',
  },
  systemMessageText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  systemMessageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
