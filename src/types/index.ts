export interface Member {
  memberId: string;
  name: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  members: Member[];
  createdAt: Date;
}

export interface Expense {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // memberId
  splitAmong: string[]; // array of memberIds
  createdAt: Date;
}

export interface ExpenseSummary {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // positive = được nhận, negative = phải trả
}

export interface PaymentTransaction {
  from: string; // memberId
  fromName: string;
  to: string; // memberId
  toName: string;
  amount: number;
}
