import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, QrCode } from 'lucide-react';
import { generateGroupId } from '../utils/groupUtils';
import { createGroup, checkGroupExists } from '../services/firebaseService';
import { useGroup } from '../context/GroupContext';
import { Group } from '../types';

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentGroup, setCurrentMember } = useGroup();
  const [userName, setUserName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      alert('Vui lòng nhập tên của bạn!');
      return;
    }

    setIsCreating(true);
    try {
      const groupId = generateGroupId();
      const memberId = `member_${Date.now()}`;
      
      const newGroup: Omit<Group, 'createdAt'> = {
        groupId,
        groupName: `Phòng ${groupId}`,
        members: [{
          memberId,
          name: userName.trim(),
        }],
      };

      await createGroup(newGroup);
      
      // Tạo group hoàn chỉnh với createdAt
      const completeGroup: Group = {
        ...newGroup,
        createdAt: new Date(),
      };
      
      setCurrentGroup(completeGroup);
      setCurrentMember({ memberId, name: userName.trim() });
      
      navigate(`/room/${groupId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại!');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim() || !joinCode.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsJoining(true);
    try {
      const exists = await checkGroupExists(joinCode.trim().toUpperCase());
      
      if (!exists) {
        alert('Mã phòng không tồn tại!');
        return;
      }

      const memberId = `member_${Date.now()}`;
      const member = { memberId, name: userName.trim() };
      
      setCurrentMember(member);
      navigate(`/room/${joinCode.trim().toUpperCase()}`);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Có lỗi xảy ra khi tham gia phòng. Vui lòng thử lại!');
    } finally {
      setIsJoining(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GPAC UEB</h1>
          <p className="text-gray-600">Chia tiền thông minh, đơn giản</p>
        </div>

        {/* Main Actions */}
        <div className="space-y-6">
          {/* Create New Room */}
          <div className="card">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Tạo Phòng Mới</h2>
              <p className="text-gray-600 text-sm">Tạo phòng mới và mời bạn bè tham gia</p>
              
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                maxLength={20}
              />
              
              <button
                onClick={handleCreateRoom}
                disabled={isCreating || !userName.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Đang tạo...' : 'Tạo Phòng Mới'}
              </button>
            </div>
          </div>

          {/* Join Existing Room */}
          <div className="card">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Tham Gia Phòng</h2>
              <p className="text-gray-600 text-sm">Nhập mã phòng hoặc quét QR code</p>
              
              <input
                type="text"
                placeholder="Mã phòng (VD: ABC-123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="input-field"
                maxLength={7}
              />
              
              <button
                onClick={handleJoinRoom}
                disabled={isJoining || !userName.trim() || !joinCode.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? 'Đang tham gia...' : 'Tham Gia Phòng'}
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="btn-secondary w-full"
              >
                <QrCode className="w-4 h-4 inline mr-2" />
                {showQR ? 'Ẩn QR Code' : 'Hiện QR Code'}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Quét QR Code</h3>
                <p className="text-sm text-gray-600">
                  Sử dụng camera điện thoại để quét mã QR của phòng
                </p>
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="btn-secondary w-full"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
