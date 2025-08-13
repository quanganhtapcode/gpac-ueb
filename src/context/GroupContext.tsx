import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Group, Member, Expense } from '../types';
import { getGroupExpenses } from '../services/firebaseService';

interface GroupContextType {
  currentGroup: Group | null;
  currentMember: Member | null;
  expenses: Expense[];
  setCurrentGroup: (group: Group | null) => void;
  setCurrentMember: (member: Member | null) => void;
  addExpense: (expense: Expense) => void;
  refreshExpenses: () => void;
  isLoading: boolean;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

interface GroupProviderProps {
  children: ReactNode;
}

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshExpenses = useCallback(async () => {
    if (!currentGroup) return;
    
    setIsLoading(true);
    try {
      const groupExpenses = await getGroupExpenses(currentGroup.groupId);
      setExpenses(groupExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  useEffect(() => {
    if (currentGroup) {
      refreshExpenses();
    }
  }, [currentGroup, refreshExpenses]);

  const value: GroupContextType = {
    currentGroup,
    currentMember,
    expenses,
    setCurrentGroup,
    setCurrentMember,
    addExpense,
    refreshExpenses,
    isLoading,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
