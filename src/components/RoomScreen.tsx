import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Calculator, Copy, Check, ArrowLeft, Users } from 'lucide-react';
import { useGroup } from '../context/GroupContext';
import { getGroup, addMemberToGroup } from '../services/firebaseService';
import { formatCurrency } from '../utils/groupUtils';
import AddExpenseModal from './AddExpenseModal';
import ExpenseList from './ExpenseList';

const RoomScreen: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { 
    currentGroup, 
    setCurrentGroup, 
    currentMember, 
    setCurrentMember,
    expenses,
    refreshExpenses 
  } = useGroup();
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroup = useCallback(async () => {
    if (!groupId) return;
    
    try {
      const group = await getGroup(groupId);
      if (group) {
        setCurrentGroup(group);
        
        // Nếu chưa có currentMember, tạo một member mới
        if (!currentMember) {
          const memberId = `member_${Date.now()}`;
          const member = { memberId, name: `Thành viên ${Date.now()}` };
          setCurrentMember(member);
          
          // Thêm member vào group
          await addMemberToGroup(groupId, member);
        }
      } else {
        alert('Không tìm thấy phòng!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading group:', error);
      alert('Có lỗi xảy ra khi tải phòng!');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [groupId, currentMember, navigate, setCurrentGroup, setCurrentMember]);

  useEffect(() => {
    if (groupId && !currentGroup) {
      loadGroup();
    } else if (currentGroup) {
      setIsLoading(false);
    }
  }, [groupId, currentGroup, loadGroup]);

  const copyRoomCode = () => {
    if (currentGroup) {
      navigator.clipboard.writeText(currentGroup.groupId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCalculate = () => {
    navigate(`/room/${groupId}/summary`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải phòng...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return null;
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentGroup.groupName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500">Mã phòng:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {currentGroup.groupId}
                  </code>
                  <button
                    onClick={copyRoomCode}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMembers(!showMembers)}
              className="btn-secondary"
            >
              <Users className="w-4 h-4 mr-2" />
              Thành viên ({currentGroup.members.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tổng chi tiêu</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-sm text-gray-600">Số khoản chi</p>
              <p className="text-2xl font-bold text-gray-900">
                {expenses.length}
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-sm text-gray-600">Thành viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentGroup.members.length}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn-primary flex-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm Chi Tiêu
          </button>
          
          <button
            onClick={handleCalculate}
            className="btn-secondary flex-1"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Tính Toán
          </button>
        </div>

        {/* Expense List */}
        <ExpenseList expenses={expenses} members={currentGroup.members} />

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddExpense(true)}
          className="floating-btn md:hidden"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          groupId={currentGroup.groupId}
          members={currentGroup.members}
          currentMember={currentMember}
          onExpenseAdded={refreshExpenses}
        />
      )}

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thành viên trong phòng</h3>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              {currentGroup.members.map((member) => (
                <div
                  key={member.memberId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{member.name}</span>
                  {member.memberId === currentMember?.memberId && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Bạn
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomScreen;
