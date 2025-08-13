# GPAC UEB - Ứng Dụng Chia Tiền Thông Minh

Ứng dụng chia tiền tối ưu với giao diện đơn giản, giúp bạn quản lý chi tiêu nhóm một cách hiệu quả.

## ✨ Tính Năng Chính

- **Tạo phòng mới** với mã phòng duy nhất
- **Tham gia phòng** bằng mã hoặc QR code
- **Nhập chi tiêu** với giao diện tối ưu
- **Tính toán tự động** và tối ưu hóa thanh toán
- **Không cần đăng nhập** - sử dụng ngay lập tức
- **Giao diện responsive** cho mọi thiết bị

## 🚀 Cách Sử Dụng

### 1. Tạo Phòng Mới
- Nhập tên của bạn
- Bấm "Tạo Phòng Mới"
- Hệ thống sẽ tạo mã phòng duy nhất (VD: ABC-123)
- Chia sẻ mã phòng với bạn bè

### 2. Tham Gia Phòng
- Nhập tên của bạn
- Nhập mã phòng đã có
- Hoặc sử dụng QR code để tham gia

### 3. Thêm Chi Tiêu
- Bấm "Thêm Chi Tiêu" 
- Nhập mô tả và số tiền
- Chọn người trả và người chia sẻ
- Sử dụng nút nhanh (+100k, +500k) để nhập tiền

### 4. Xem Kết Quả
- Bấm "Tính Toán" để xem tổng kết
- Hệ thống sẽ hiển thị:
  - Tổng chi tiêu của nhóm
  - Số dư của từng thành viên
  - Hướng dẫn thanh toán tối ưu

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Routing**: React Router
- **Icons**: Lucide React
- **QR Code**: QRCode.react

## 📱 Giao Diện

### Màn Hình 1: Bắt Đầu
- Tạo phòng mới
- Tham gia phòng hiện có
- Giao diện đơn giản, chỉ 2 hành động chính

### Màn Hình 2: Bảng Chi Tiêu
- Hiển thị danh sách chi tiêu
- Nút "Thêm Chi Tiêu" nổi bật
- Nút "Tính Toán" để xem kết quả

### Màn Hình 3: Nhập Chi Tiêu
- Form nhập liệu tối ưu
- Nút nhanh cho số tiền
- Chọn người trả và người chia sẻ

### Màn Hình 4: Kết Quả
- Tổng kết chi tiêu
- Chi tiết từng thành viên
- Hướng dẫn thanh toán tối ưu

## 🔧 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js 16+ 
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd gpac_ueb
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình Firebase
1. Tạo project Firebase mới
2. Bật Firestore Database
3. Cập nhật thông tin trong `src/firebase/config.ts`

### Bước 4: Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📊 Cấu Trúc Database

### Collection: groups
- `groupId`: Mã phòng duy nhất
- `groupName`: Tên nhóm
- `members`: Danh sách thành viên
- `createdAt`: Thời gian tạo

### Collection: expenses
- `expenseId`: ID chi tiêu
- `groupId`: ID nhóm
- `description`: Mô tả
- `amount`: Số tiền
- `paidBy`: Người trả
- `splitAmong`: Danh sách người chia sẻ
- `createdAt`: Thời gian tạo

## 🎯 Thuật Toán Tối Ưu

Ứng dụng sử dụng thuật toán tối ưu hóa để giảm thiểu số lần chuyển tiền:

1. **Tính toán balance** cho từng thành viên
2. **Sắp xếp** theo thứ tự nợ/cho
3. **Gộp các khoản nợ** để tối ưu hóa
4. **Tạo danh sách giao dịch** tối thiểu

## 📱 Responsive Design

- **Mobile-first** approach
- **Floating action button** cho mobile
- **Grid layout** thích ứng
- **Touch-friendly** interface

## 🔒 Bảo Mật

- **Không lưu thông tin cá nhân** nhạy cảm
- **Mã phòng ngẫu nhiên** khó đoán
- **Firebase Security Rules** có thể cấu hình
- **Không cần đăng nhập** - bảo mật đơn giản

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy lên Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork dự án
2. Tạo feature branch
3. Commit thay đổi
4. Push lên branch
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 📞 Liên Hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

**GPAC UEB** - Chia tiền thông minh, đơn giản! 🎉
