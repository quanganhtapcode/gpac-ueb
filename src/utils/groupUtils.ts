import { Group, Expense, ExpenseSummary, PaymentTransaction } from '../types';

// Tạo mã phòng ngẫu nhiên
export const generateGroupId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Tính toán tổng kết chi tiêu cho từng thành viên
export const calculateExpenseSummary = (
  group: Group,
  expenses: Expense[]
): ExpenseSummary[] => {
  const summaryMap = new Map<string, ExpenseSummary>();

  // Khởi tạo summary cho mỗi thành viên
  group.members.forEach(member => {
    summaryMap.set(member.memberId, {
      memberId: member.memberId,
      memberName: member.name,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0,
    });
  });

  // Tính toán từng khoản chi tiêu
  expenses.forEach(expense => {
    const paidBy = summaryMap.get(expense.paidBy);
    if (paidBy) {
      paidBy.totalPaid += expense.amount;
    }

    const splitAmount = expense.amount / expense.splitAmong.length;
    expense.splitAmong.forEach(memberId => {
      const member = summaryMap.get(memberId);
      if (member) {
        member.totalOwed += splitAmount;
      }
    });
  });

  // Tính balance
  summaryMap.forEach(summary => {
    summary.balance = summary.totalPaid - summary.totalOwed;
  });

  return Array.from(summaryMap.values());
};

// Tối ưu hóa các giao dịch thanh toán
export const optimizePayments = (summary: ExpenseSummary[]): PaymentTransaction[] => {
  const transactions: PaymentTransaction[] = [];
  const creditors = summary.filter(s => s.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = summary.filter(s => s.balance < 0).sort((a, b) => a.balance - b.balance);

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    if (Math.abs(creditor.balance) < 0.01 || Math.abs(debtor.balance) < 0.01) {
      creditorIndex++;
      debtorIndex++;
      continue;
    }

    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    transactions.push({
      from: debtor.memberId,
      fromName: debtor.memberName,
      to: creditor.memberId,
      toName: creditor.memberName,
      amount: Math.round(amount),
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (Math.abs(creditor.balance) < 0.01) creditorIndex++;
    if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
  }

  return transactions;
};

// Format tiền tệ
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};
