import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Group, Expense, Member } from '../types';

// Tạo phòng mới
export const createGroup = async (group: Omit<Group, 'createdAt'>): Promise<void> => {
  const groupRef = doc(db, 'groups', group.groupId);
  await setDoc(groupRef, {
    ...group,
    createdAt: serverTimestamp(),
  });
};

// Lấy thông tin phòng
export const getGroup = async (groupId: string): Promise<Group | null> => {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (groupSnap.exists()) {
    const data = groupSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Group;
  }
  
  return null;
};

// Thêm thành viên vào phòng
export const addMemberToGroup = async (groupId: string, member: Member): Promise<void> => {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (groupSnap.exists()) {
    const group = groupSnap.data() as Group;
    const updatedMembers = [...group.members, member];
    
    await setDoc(groupRef, {
      ...group,
      members: updatedMembers,
    });
  }
};

// Tạo khoản chi tiêu mới
export const createExpense = async (expense: Omit<Expense, 'expenseId' | 'createdAt'>): Promise<string> => {
  const expenseRef = await addDoc(collection(db, 'expenses'), {
    ...expense,
    createdAt: serverTimestamp(),
  });
  
  return expenseRef.id;
};

// Lấy tất cả khoản chi tiêu của một phòng
export const getGroupExpenses = async (groupId: string): Promise<Expense[]> => {
  const expensesRef = collection(db, 'expenses');
  const q = query(
    expensesRef,
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    expenses.push({
      ...data,
      expenseId: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Expense);
  });
  
  return expenses;
};

// Kiểm tra xem phòng có tồn tại không
export const checkGroupExists = async (groupId: string): Promise<boolean> => {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  return groupSnap.exists();
};
