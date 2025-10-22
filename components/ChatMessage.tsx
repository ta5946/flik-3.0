import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ChatMessage as ChatMessageType } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  onReply?: (message: ChatMessageType) => void;
}

export default function ChatMessage({ message, isCurrentUser, onReply }: ChatMessageProps) {
  const colorScheme = useColorScheme();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sl-SI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return 'creditcard';
      case 'system':
        return 'info.circle';
      default:
        return null;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'expense':
        return Colors[colorScheme ?? 'light'].primary;
      case 'system':
        return Colors[colorScheme ?? 'light'].icon;
      default:
        return isCurrentUser ? 'white' : Colors[colorScheme ?? 'light'].text;
    }
  };

  return (
    <View style={[
      styles.messageContainer,
      isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
    ]}>
      {!isCurrentUser && (
        <View style={styles.senderAvatar}>
          <ThemedText style={styles.senderInitial}>
            {message.senderName.charAt(0)}
          </ThemedText>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        message.type === 'system' && styles.systemBubble
      ]}>
        {!isCurrentUser && message.type !== 'system' && (
          <ThemedText style={styles.senderName}>
            {message.senderName}
          </ThemedText>
        )}
        
        {message.type !== 'text' && (
          <View style={styles.messageIcon}>
            <IconSymbol 
              name={getMessageIcon(message.type) || 'message'} 
              size={16} 
              color={getMessageColor(message.type)} 
            />
          </View>
        )}
        
        <ThemedText style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText,
          message.type === 'system' && styles.systemText
        ]}>
          {message.message}
        </ThemedText>
        
        <ThemedText style={[
          styles.messageTime,
          isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
          message.type === 'system' && styles.systemTime
        ]}>
          {formatTime(message.timestamp)}
        </ThemedText>
      </View>
      
      {message.type === 'text' && onReply && (
        <TouchableOpacity 
          style={styles.replyButton}
          onPress={() => onReply(message)}
        >
          <IconSymbol name="arrowshape.turn.up.left" size={16} color={Colors[colorScheme ?? 'light'].icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  senderInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: '#1e40af',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  messageIcon: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#1e293b',
  },
  systemText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherUserTime: {
    color: '#94a3b8',
  },
  systemTime: {
    color: '#94a3b8',
    textAlign: 'center',
  },
  replyButton: {
    padding: 8,
    marginLeft: 8,
  },
});
