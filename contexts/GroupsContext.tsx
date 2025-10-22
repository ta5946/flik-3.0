import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  balance: number;
  avatar?: string;
}

export interface GroupExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  category: string;
}

export interface PaymentTransaction {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'payment' | 'request';
  status: 'pending' | 'completed' | 'cancelled';
  description: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'expense' | 'system';
  expenseId?: string; // For expense-related messages
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  totalExpenses: number;
  budget: number;
  expenses: GroupExpense[];
  currency: string;
  color: string;
  createdAt: string;
  ownerId: string;
  closed: boolean;
}

interface GroupsContextType {
  groups: Group[];
  transactions: PaymentTransaction[];
  messages: ChatMessage[];
  addGroup: (group: Omit<Group, 'id' | 'totalExpenses' | 'expenses' | 'createdAt'>) => void;
  addExpense: (groupId: string, expense: Omit<GroupExpense, 'id' | 'date'>) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  getGroupById: (groupId: string) => Group | undefined;
  settleUpGroup: (groupId: string) => void;
  addTransaction: (transaction: Omit<PaymentTransaction, 'id' | 'createdAt'>) => void;
  getTransactionsByGroup: (groupId: string) => PaymentTransaction[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getMessagesByGroup: (groupId: string) => ChatMessage[];
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

// Mock members for selection
export const MOCK_MEMBERS: GroupMember[] = [
  { id: '1', name: 'Janez Novak', phone: '+386 40 123 456', balance: 0 },
  { id: '2', name: 'ALJAŽ V.', phone: '+386 40 102 030', balance: 0 },
  { id: '3', name: 'MARTA K.', phone: '+386 41 234 567', balance: 0 },
  { id: '4', name: 'PETRA M.', phone: '+386 42 345 678', balance: 0 },
  { id: '5', name: 'MIHA M.', phone: '+386 43 456 789', balance: 0 },
  { id: '6', name: 'ANA S.', phone: '+386 44 567 890', balance: 0 },
  { id: '7', name: 'MARKO P.', phone: '+386 45 678 901', balance: 0 },
  { id: '8', name: 'LARA T.', phone: '+386 46 789 012', balance: 0 },
];

const STORAGE_KEY = '@flik_groups';
const TRANSACTIONS_KEY = '@flik_transactions';
const MESSAGES_KEY = '@flik_messages';

export const GroupsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load groups, transactions, and messages from storage on mount
  useEffect(() => {
    loadGroups();
    loadTransactions();
    loadMessages();
  }, []);

  // Save groups to storage whenever groups change
  useEffect(() => {
    saveGroups();
  }, [groups]);

  // Save transactions to storage whenever transactions change
  useEffect(() => {
    saveTransactions();
  }, [transactions]);

  // Save messages to storage whenever messages change
  useEffect(() => {
    saveMessages();
  }, [messages]);

  const loadGroups = async () => {
    try {
      const storedGroups = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups);
        setGroups(parsedGroups);
      } else {
        // Initialize with some default groups if none exist
        const defaultGroups: Group[] = [
          {
            id: '1',
            name: 'Potovanje v Italijo',
            members: [
              { id: '1', name: 'Janez Novak', phone: '+386 40 123 456', balance: -87.25 },
              { id: '2', name: 'ALJAŽ V.', phone: '+386 40 102 030', balance: 45.30 },
              { id: '3', name: 'MARTA K.', phone: '+386 41 234 567', balance: 23.15 },
              { id: '4', name: 'PETRA M.', phone: '+386 42 345 678', balance: 18.80 },
            ],
            totalExpenses: 1250.50,
            budget: 1500.00,
            expenses: [
              {
                id: '1',
                description: 'Hotelski račun',
                amount: 320.00,
                paidBy: 'Janez Novak',
                splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
                date: '2024-01-14',
                category: 'accommodation',
              },
              {
                id: '2',
                description: 'Večerja v restavraciji',
                amount: 85.50,
                paidBy: 'ALJAŽ V.',
                splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
                date: '2024-01-13',
                category: 'food',
              },
              {
                id: '3',
                description: 'Benzin',
                amount: 45.00,
                paidBy: 'MARTA K.',
                splitBetween: ['Janez Novak', 'ALJAŽ V.', 'MARTA K.', 'PETRA M.'],
                date: '2024-01-12',
                category: 'transport',
              },
            ],
            currency: 'EUR',
            color: '#FF9AA2',
            createdAt: new Date().toISOString(),
            ownerId: '1',
            closed: false,
          },
        ];
        setGroups(defaultGroups);

        // Add some sample messages for the default group
        const sampleMessages: ChatMessage[] = [
          {
            id: '1',
            groupId: '1',
            senderId: 'system',
            senderName: 'Sistem',
            content: 'Skupina "Potovanje v Italijo" je bila uspešno ustvarjena! 🎉',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            type: 'system',
          },
          {
            id: '2',
            groupId: '1',
            senderId: '1',
            senderName: 'Janez Novak',
            content: 'Pozdravljeni! Kdaj se odpravljamo?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
            type: 'text',
          },
          {
            id: '3',
            groupId: '1',
            senderId: '2',
            senderName: 'ALJAŽ V.',
            content: 'Mislim, da se dogovorimo za naslednji teden!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
            type: 'text',
          },
          {
            id: '4',
            groupId: '1',
            senderId: 'system',
            senderName: 'Sistem',
            content: 'Janez Novak je dodal/a strošek "Hotelski račun" za 320.00 EUR',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            type: 'expense',
            expenseId: '1',
          },
          {
            id: '5',
            groupId: '1',
            senderId: '3',
            senderName: 'MARTA K.',
            content: 'Super! Hotel je rezerviran. Kje se bomo srečali?',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            type: 'text',
          },
        ];
        setMessages(sampleMessages);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const saveGroups = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        console.log('Loaded transactions from storage:', parsedTransactions);
        setTransactions(parsedTransactions);
      } else {
        console.log('No stored transactions found');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async () => {
    try {
      console.log('Saving transactions to storage:', transactions);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      console.log('Transactions saved successfully');
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(MESSAGES_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        console.log('Loaded messages from storage:', parsedMessages);
        setMessages(parsedMessages);
      } else {
        console.log('No stored messages found');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async () => {
    try {
      console.log('Saving messages to storage:', messages);
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      console.log('Messages saved successfully');
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const addGroup = (groupData: Omit<Group, 'id' | 'totalExpenses' | 'expenses' | 'createdAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString(),
      totalExpenses: 0,
      expenses: [],
      createdAt: new Date().toISOString(),
      closed: false,
    };
    setGroups(prev => [...prev, newGroup]);

    // Add welcome message to the group chat
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString() + '_welcome',
      groupId: newGroup.id,
      senderId: 'system',
      senderName: 'Sistem',
      content: `Skupina "${newGroup.name}" je bila uspešno ustvarjena! 🎉`,
      timestamp: new Date().toISOString(),
      type: 'system',
    };
    
    setMessages(prev => [...prev, welcomeMessage]);
  };

  const addExpense = (groupId: string, expenseData: Omit<GroupExpense, 'id' | 'date'>) => {
    const expense: GroupExpense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedExpenses = [...group.expenses, expense];
        const newTotalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        // Calculate new balances for each member
        const updatedMembers = group.members.map(member => {
          let newBalance = member.balance;
          
          // If this member paid for the expense, add the full amount to their balance
          if (member.name === expense.paidBy) {
            newBalance += expense.amount;
          }
          
          // Subtract their share from their balance
          const memberShare = expense.amount / expense.splitBetween.length;
          newBalance -= memberShare;
          
          return { ...member, balance: newBalance };
        });

        return {
          ...group,
          expenses: updatedExpenses,
          totalExpenses: newTotalExpenses,
          members: updatedMembers,
        };
      }
      return group;
    }));

    // Add expense notification message to the group chat
    const expenseMessage: ChatMessage = {
      id: Date.now().toString() + '_expense',
      groupId: groupId,
      senderId: 'system',
      senderName: 'Sistem',
      content: `${expense.paidBy} je dodal/a strošek "${expense.description}" za ${expense.amount.toFixed(2)} EUR`,
      timestamp: new Date().toISOString(),
      type: 'expense',
      expenseId: expense.id,
    };
    
    setMessages(prev => [...prev, expenseMessage]);
  };

  const updateGroup = (groupId: string, updates: Partial<Group>) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const getGroupById = (groupId: string) => {
    return groups.find(group => group.id === groupId);
  };

  const settleUpGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const ownerId = group.ownerId;
    const newTransactions: PaymentTransaction[] = [];

    // Create transactions for each member based on their balance
    group.members.forEach(member => {
      if (member.balance !== 0 && member.id !== ownerId) { // Don't create transactions for the owner
        if (member.balance > 0) {
          // Member is owed money - create payment transaction from owner to member
          newTransactions.push({
            id: Date.now().toString() + '_' + member.id,
            groupId: groupId,
            fromUserId: ownerId,
            toUserId: member.id,
            amount: Math.abs(member.balance),
            type: 'payment',
            status: 'completed',
            description: `Poravnava dolga za skupino ${group.name}`,
            createdAt: new Date().toISOString(),
          });
        } else {
          // Member owes money - create request transaction from member to owner
          newTransactions.push({
            id: Date.now().toString() + '_' + member.id,
            groupId: groupId,
            fromUserId: member.id,
            toUserId: ownerId,
            amount: Math.abs(member.balance),
            type: 'request',
            status: 'pending',
            description: `Zahteva za plačilo dolga za skupino ${group.name}`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    // Add all transactions
    setTransactions(prev => [...prev, ...newTransactions]);

    // Reset all member balances to 0 and mark group as closed
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const settledMembers = g.members.map(member => ({
          ...member,
          balance: 0
        }));
        
        return {
          ...g,
          members: settledMembers,
          closed: true
        };
      }
      return g;
    }));
  };

  const addTransaction = (transactionData: Omit<PaymentTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: PaymentTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    console.log('Adding transaction to context:', newTransaction);
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      console.log('Updated transactions array:', updated);
      return updated;
    });
  };

  const getTransactionsByGroup = (groupId: string) => {
    return transactions.filter(transaction => transaction.groupId === groupId);
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    console.log('Adding message to context:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages array:', updated);
      return updated;
    });
  };

  const getMessagesByGroup = (groupId: string) => {
    return messages.filter(message => message.groupId === groupId);
  };

  const value: GroupsContextType = {
    groups,
    transactions,
    messages,
    addGroup,
    addExpense,
    updateGroup,
    deleteGroup,
    getGroupById,
    settleUpGroup,
    addTransaction,
    getTransactionsByGroup,
    addMessage,
    getMessagesByGroup,
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
