import React from 'react';
import { formatCurrency } from '../utils/groupUtils';
import { Expense, Member } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, members }) => {
  if (expenses.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chi tiêu nào</h3>
        <p className="text-gray-600">Bắt đầu thêm chi tiêu đầu tiên để theo dõi chi phí nhóm</p>
      </div>
    );
  }

  const getMemberName = (memberId: string): string => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.name : 'Không xác định';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Danh sách chi tiêu</h2>
      
      {expenses.map((expense) => (
        <div key={expense.expenseId} className="card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                {expense.description}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  <span className="font-medium">Trả bởi:</span> {getMemberName(expense.paidBy)}
                </span>
                <span>
                  <span className="font-medium">Chia cho:</span> {expense.splitAmong.length} người
                </span>
                <span>
                  <span className="font-medium">Thời gian:</span> {formatDate(expense.createdAt)}
                </span>
              </div>
              
              {expense.splitAmong.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Chia cho: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expense.splitAmong.map((memberId) => (
                      <span
                        key={memberId}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {getMemberName(memberId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(expense.amount)}
              </div>
              <div className="text-sm text-gray-500">
                {formatCurrency(expense.amount / expense.splitAmong.length)} / người
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
