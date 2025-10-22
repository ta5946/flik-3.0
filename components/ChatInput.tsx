import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachImage?: () => void;
  placeholder?: string;
  maxLength?: number;
}

export default function ChatInput({ 
  onSendMessage, 
  onAttachImage, 
  placeholder = "Napišite sporočilo...",
  maxLength = 500 
}: ChatInputProps) {
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleAttachImage = () => {
    if (onAttachImage) {
      onAttachImage();
    } else {
      Alert.alert('Funkcija', 'Nalaganje slik bo kmalu na voljo!');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity 
        style={styles.attachButton}
        onPress={handleAttachImage}
      >
        <IconSymbol 
          name="image" 
          size={24} 
          color={Colors[colorScheme ?? 'light'].icon} 
        />
      </TouchableOpacity>
      
      <TextInput
        style={[
          styles.messageInput,
          { 
            color: Colors[colorScheme ?? 'light'].text,
            backgroundColor: Colors[colorScheme ?? 'light'].background
          }
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        multiline
        maxLength={maxLength}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      
      <TouchableOpacity 
        style={[
          styles.sendButton,
          { 
            backgroundColor: message.trim() 
              ? Colors[colorScheme ?? 'light'].primary 
              : Colors[colorScheme ?? 'light'].icon 
          }
        ]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <IconSymbol name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  attachButton: {
    padding: 12,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    ...Platform.select({
      ios: {
        paddingTop: 12,
      },
      android: {
        textAlignVertical: 'top',
      },
    }),
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
