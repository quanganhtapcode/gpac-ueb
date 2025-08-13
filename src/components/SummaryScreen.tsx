import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react';
import { useGroup } from '../context/GroupContext';
import { calculateExpenseSummary, optimizePayments, formatCurrency } from '../utils/groupUtils';

const SummaryScreen: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { currentGroup, expenses } = useGroup();
  const [copied, setCopied] = useState(false);

  if (!currentGroup) {
    navigate('/');
    return null;
  }

  const summary = calculateExpenseSummary(currentGroup, expenses);
  const transactions = optimizePayments(summary);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySummary = () => {
    const summaryText = `📊 TỔNG KẾT CHI TIÊU - ${currentGroup.groupName}

💰 Tổng chi tiêu: ${formatCurrency(totalExpenses)}
👥 Số thành viên: ${currentGroup.members.length}

📋 CHI TIẾT TỪNG NGƯỜI:
${summary.map(s => 
  `• ${s.memberName}: ${formatCurrency(s.totalPaid)} (trả) - ${formatCurrency(s.totalOwed)} (nợ) = ${formatCurrency(s.balance)}`
).join('\n')}

💸 HƯỚNG DẪN THANH TOÁN:
${transactions.map(t => 
  `• ${t.fromName} → ${t.toName}: ${formatCurrency(t.amount)}`
).join('\n')}

🔗 Mã phòng: ${currentGroup.groupId}`;

    copyToClipboard(summaryText);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/room/${groupId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900">
              Kết Quả Thanh Toán
            </h1>
            
            <button
              onClick={copySummary}
              className="btn-secondary"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              Sao chép
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Total Summary */}
        <div className="card mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tổng Kết Chi Tiêu
            </h2>
            <p className="text-gray-600 mb-4">
              {currentGroup.groupName} • {currentGroup.members.length} thành viên
            </p>
            
            <div className="text-4xl font-bold text-primary-600 mb-4">
              {formatCurrency(totalExpenses)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Số khoản chi</p>
                <p className="text-xl font-semibold text-gray-900">
                  {expenses.length}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Thành viên</p>
                <p className="text-xl font-semibold text-gray-900">
                  {currentGroup.members.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Summary */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Chi Tiết Từng Thành Viên
          </h3>
          
          <div className="space-y-3">
            {summary.map((member) => (
              <div
                key={member.memberId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">
                    {member.memberName}
                  </span>
                  {member.memberId === currentGroup.members.find(m => m.memberId === member.memberId)?.memberId && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Bạn
                    </span>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Đã trả: {formatCurrency(member.totalPaid)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Nợ: {formatCurrency(member.totalOwed)}
                  </div>
                  <div className={`text-lg font-semibold ${
                    member.balance > 0 ? 'text-green-600' : 
                    member.balance < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {member.balance > 0 ? '+' : ''}{formatCurrency(member.balance)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hướng Dẫn Thanh Toán
          </h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-500 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Tất cả đã được thanh toán!
              </h4>
              <p className="text-gray-600">
                Không có khoản nợ nào cần thanh toán giữa các thành viên.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">
                      {transaction.fromName}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {transaction.toName}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Cần chuyển
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Lưu ý:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Các khoản thanh toán đã được tối ưu hóa để giảm thiểu số lần chuyển tiền</li>
              <li>• Số tiền dương (+) nghĩa là được nhận, số âm (-) nghĩa là phải trả</li>
              <li>• Có thể sử dụng chức năng "Sao chép" để chia sẻ kết quả với nhóm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
