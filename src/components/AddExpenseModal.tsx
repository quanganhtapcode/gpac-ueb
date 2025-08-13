import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { createExpense } from '../services/firebaseService';
import { Expense, Member } from '../types';
import { formatCurrency } from '../utils/groupUtils';

interface AddExpenseModalProps {
  onClose: () => void;
  groupId: string;
  members: Member[];
  currentMember: Member | null;
  onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  onClose,
  groupId,
  members,
  currentMember,
  onExpenseAdded,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentMember?.memberId || '');
  const [splitAmong, setSplitAmong] = useState<string[]>(
    members.map(m => m.memberId)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickAmounts = [10000, 50000, 100000, 200000, 500000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(prev => {
      const current = parseInt(prev) || 0;
      return (current + quickAmount).toString();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !paidBy || splitAmong.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Số tiền không hợp lệ!');
      return;
    }

    setIsSubmitting(true);
    try {
      const newExpense: Omit<Expense, 'expenseId' | 'createdAt'> = {
        groupId,
        description: description.trim(),
        amount: amountNum,
        paidBy,
        splitAmong,
      };

      await createExpense(newExpense);
      onExpenseAdded();
      onClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Có lỗi xảy ra khi tạo chi tiêu. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSplit = (memberId: string) => {
    setSplitAmong(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const toggleAllMembers = () => {
    if (splitAmong.length === members.length) {
      setSplitAmong([]);
    } else {
      setSplitAmong(members.map(m => m.memberId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Thêm Chi Tiêu Mới</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiêu
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Tiền ăn trưa, tiền taxi..."
                className="input-field"
                maxLength={100}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền (VNĐ)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="input-field"
                min="0"
                required
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    +{formatCurrency(quickAmount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Paid By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ai là người trả?
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Chọn người trả</option>
                {members.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Split Among */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chia cho ai?
                </label>
                <button
                  type="button"
                  onClick={toggleAllMembers}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {splitAmong.length === members.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              
              <div className="space-y-2">
                {members.map((member) => (
                  <label
                    key={member.memberId}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={splitAmong.includes(member.memberId)}
                      onChange={() => toggleMemberSplit(member.memberId)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {member.name}
                    </span>
                    {member.memberId === currentMember?.memberId && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        Bạn
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !description.trim() || !amount || !paidBy || splitAmong.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu Chi Tiêu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
