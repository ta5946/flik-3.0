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
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (group: Omit<Group, 'id' | 'totalExpenses' | 'expenses' | 'createdAt'>) => void;
  addExpense: (groupId: string, expense: Omit<GroupExpense, 'id' | 'date'>) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  getGroupById: (groupId: string) => Group | undefined;
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

export const GroupsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  // Load groups from storage on mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Save groups to storage whenever groups change
  useEffect(() => {
    saveGroups();
  }, [groups]);

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
          },
        ];
        setGroups(defaultGroups);
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

  const addGroup = (groupData: Omit<Group, 'id' | 'totalExpenses' | 'expenses' | 'createdAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString(),
      totalExpenses: 0,
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => [...prev, newGroup]);
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

  const value: GroupsContextType = {
    groups,
    addGroup,
    addExpense,
    updateGroup,
    deleteGroup,
    getGroupById,
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
