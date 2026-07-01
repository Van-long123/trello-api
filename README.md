# ⚙️ Dự Án API Trello

## 📖 Tổng Quan

Dự án này là một API backend toàn diện, mô phỏng đầy đủ các chức năng cốt lõi của Trello. Hệ thống hỗ trợ quản lý bảng, cột, thẻ và người dùng thông qua API RESTful với đầy đủ các thao tác CRUD, đồng thời cung cấp khả năng xử lý nâng cao như di chuyển thẻ giữa các cột. Ngoài ra, dự án còn tích hợp phân quyền người dùng, xác thực email, tải lên hình ảnh, thông báo thời gian thực và nhiều tính năng mở rộng khác, mang đến một nền tảng backend mạnh mẽ và linh hoạt cho việc xây dựng ứng dụng quản lý công việc hiện đại.

## 🚀 Tính Năng

### Tính Năng Cốt Lõi

- **Quản Lý Bảng**: Tạo, truy xuất, cập nhật và xóa bảng
- **Quản Lý Cột**: Quản lý các cột trong bảng, sắp xếp và di chuyển cột
- **Quản Lý Thẻ**: Tạo và quản lý các thẻ trong cột, thêm mô tả và chi tiết thẻ
- **Di Chuyển Thẻ**: Hỗ trợ di chuyển thẻ giữa các cột khác nhau

### Tính Năng Người Dùng

- **Đăng Ký & Đăng Nhập**: Hệ thống xác thực người dùng hoàn chỉnh
- **Xác Thực Email**: Xác minh tài khoản người dùng qua email
- **JWT Authentication**: Bảo mật với access token và refresh token
- **Quản Lý Hồ Sơ**: Cập nhật thông tin người dùng và ảnh đại diện

### Tính Năng Nâng Cao

- **Mời Thành Viên**: Hệ thống mời người dùng tham gia bảng
- **Thông Báo Thời Gian Thực**: Tích hợp Socket.IO cho cập nhật tức thì
- **Upload Hình Ảnh**: Tích hợp Cloudinary để lưu trữ và quản lý hình ảnh
- **Gửi Email**: Tích hợp NodeMailer để gửi email thông báo và xác thực

### Tính Năng Kỹ Thuật

- **Xác Thực Dữ Liệu**: Kiểm tra đầu vào chặt chẽ với schema Joi
- **Xử Lý Lỗi**: Middleware xử lý lỗi tập trung
- **Bảo Mật API**: CORS protection và các biện pháp bảo mật khác
- **Tích Hợp MongoDB**: Lưu trữ dữ liệu an toàn với MongoDB Atlas
- **Logging**: Hệ thống ghi log chi tiết cho quá trình debug và giám sát

## 🛠️ Công Nghệ Sử Dụng

### Core Technologies

- **Node.js**: Môi trường chạy JavaScript phía server
- **Express**: Framework phát triển web API RESTful
- **MongoDB**: Cơ sở dữ liệu NoSQL (thông qua MongoDB Atlas)
- **Socket.IO**: Thư viện cho kết nối web thời gian thực
- **JWT**: JSON Web Token cho xác thực và bảo mật API

### Processing & Middleware

- **Babel**: Trình biên dịch JavaScript cho phép sử dụng các tính năng JavaScript hiện đại
- **Joi**: Thư viện xác thực schema và validate dữ liệu
- **Bcrypt**: Mã hóa và bảo mật mật khẩu
- **Multer**: Middleware xử lý upload file
- **Cookie-parser**: Xử lý và quản lý cookies

### Integration Libraries

- **Cloudinary**: Dịch vụ lưu trữ và quản lý hình ảnh trực tuyến
- **NodeMailer**: Dịch vụ gửi email và thông báo
- **CORS**: Cross-Origin Resource Sharing bảo mật

### Utilities

- **Lodash**: Thư viện tiện ích để làm việc với mảng, đối tượng, v.v.
- **UUID**: Tạo các định danh duy nhất
- **ms**: Chuyển đổi giữa các đơn vị thời gian
- **http-status-codes**: Quản lý mã trạng thái HTTP
- **async-exit-hook**: Xử lý sự kiện thoát ứng dụng

## 🏗️ Kiến Trúc Dự Án

Dự án được xây dựng theo mô hình kiến trúc phân lớp (Layered Architecture) kết hợp với nguyên tắc thiết kế hướng dịch vụ, tách biệt rõ ràng các thành phần và trách nhiệm.

### Cấu Trúc Thư Mục

```
src/
├── config/           # Các file cấu hình ứng dụng
│   ├── cors.js       # Cấu hình CORS protection
│   ├── environment.js # Quản lý biến môi trường
│   └── mongodb.js    # Kết nối và quản lý MongoDB
├── controllers/      # Các controller xử lý endpoint API
│   ├── boardController.js
│   ├── cardController.js
│   ├── columnController.js
│   ├── invitationController.js
│   └── userController.js
├── middlewares/      # Các middleware tùy chỉnh
│   ├── authMiddleware.js      # Xác thực JWT
│   ├── errorHandlingMiddleware.js # Xử lý lỗi tập trung
│   └── multerUploadMiddleware.js  # Xử lý upload file
├── models/           # Các model cơ sở dữ liệu và định nghĩa schema
│   ├── boardModel.js
│   ├── cardModel.js
│   ├── columnModel.js
│   ├── invitationModel.js
│   └── userModel.js
├── providers/        # Các nhà cung cấp dịch vụ bên ngoài
│   ├── BrevoProvider.js    # Dịch vụ gửi email
│   ├── CloudinaryProvider.js # Dịch vụ lưu trữ hình ảnh
│   └── JwtProvider.js     # Dịch vụ xử lý JWT
├── routes/           # Định nghĩa các route API
│   ├── v1/           # Các route API v1
│   │   ├── boardRoute.js
│   │   ├── cardRoute.js
│   │   ├── columnRoute.js
│   │   ├── index.js
│   │   ├── invitationRoute.js
│   │   └── userRoute.js
│   └── v2/           # Các route API v2 (để sử dụng trong tương lai)
├── services/         # Logic nghiệp vụ
│   ├── boardService.js
│   ├── cardService.js
│   ├── columnService.js
│   ├── invitationService.js
│   └── userService.js
├── sockets/          # Triển khai WebSocket
│   └── inviteUserToBoardSocket.js
├── utils/            # Các hàm tiện ích
│   ├── algorithms.js
│   ├── ApiError.js   # Class quản lý lỗi tùy chỉnh
│   ├── constants.js
│   ├── formatters.js
│   ├── sorts.js
│   └── validators.js
├── validations/      # Các schema xác thực yêu cầu
│   ├── boardValidation.js
│   ├── cardValidation.js
│   ├── columnValidation.js
│   ├── invitationValidation.js
│   └── userValidation.js
└── server.js         # Điểm vào của ứng dụng
```

### Luồng Xử Lý Request

1. **Client Request** → Gửi yêu cầu HTTP tới server
2. **server.js** → Điểm vào chính, cấu hình Express và middleware
3. **Middleware** → Xử lý xác thực, phân quyền, validate dữ liệu
4. **Routes** → Định tuyến đến controller tương ứng
5. **Controllers** → Tiếp nhận request, gọi đến service
6. **Services** → Xử lý logic nghiệp vụ, tương tác với models
7. **Models** → Tương tác với cơ sở dữ liệu MongoDB
8. **Response** → Trả kết quả về cho client

## ⚙️ Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 18 trở lên
- **NPM**: Phiên bản 8 trở lên
- **MongoDB**: Tài khoản MongoDB Atlas hoặc cài đặt MongoDB cục bộ
- **Tài khoản Brevo**: Để gửi email xác thực (trước đây là SendinBlue)
- **Tài khoản Cloudinary**: Để lưu trữ và quản lý hình ảnh

### Cài Đặt Dự Án

1. **Clone dự án**:

```bash
git clone https://github.com/Van-long123/trello-api.git
cd trello-api
```

2. **Cài đặt các gói phụ thuộc**:

```bash
npm install
```

### Chạy Ứng Dụng

#### Chế Độ Phát Triển với Hot Reloading

```bash
npm run dev
```

#### Build và Chạy cho Production

```bash
npm run build     # Build dự án
npm run production  # Chạy ở chế độ sản xuất
```

## 📚 Tài Liệu API

### Kiểm Tra Trạng Thái API

- `GET /v1/status` - Kiểm tra API hoạt động

### API Bảng (Boards)

- `GET /v1/boards` - Lấy danh sách bảng của người dùng đã đăng nhập
- `POST /v1/boards` - Tạo bảng mới
- `GET /v1/boards/:id` - Lấy chi tiết bảng theo ID
- `PUT /v1/boards/:id` - Cập nhật bảng theo ID
- `PUT /v1/boards/supports/moving_card` - Di chuyển thẻ giữa các cột

### API Cột (Columns)

- `POST /v1/columns` - Tạo cột mới
- `PUT /v1/columns/:id` - Cập nhật cột theo ID
- `DELETE /v1/columns/:id` - Xóa cột (soft delete)

### API Thẻ (Cards)

- `POST /v1/cards` - Tạo thẻ mới
- `PUT /v1/cards/:id` - Cập nhật thẻ theo ID
- `DELETE /v1/cards/:id` - Xóa thẻ (soft delete)

### API Người Dùng (Users)

- `POST /v1/users/register` - Đăng ký người dùng mới
- `PUT /v1/users/verify` - Xác thực tài khoản qua email
- `POST /v1/users/login` - Đăng nhập
- `DELETE /v1/users/logout` - Đăng xuất
- `GET /v1/users/refresh_token` - Làm mới token
- `PUT /v1/users/update` - Cập nhật thông tin người dùng và avatar

### API Lời Mời (Invitations)

- `GET /v1/invitations` - Lấy danh sách lời mời
- `POST /v1/invitations/board` - Gửi lời mời tham gia bảng
- `PUT /v1/invitations/board/:invitationId` - Chấp nhận/từ chối lời mời

## 📦 Các Script Dự Án

- `npm run lint` - Chạy ESLint để kiểm tra chất lượng mã
- `npm run clean` - Xóa thư mục build và tạo mới
- `npm run build-babel` - Biên dịch mã nguồn bằng Babel
- `npm run build` - Chạy script clean và build-babel
- `npm run production` - Build dự án và chạy ở chế độ sản xuất
- `npm run dev` - Chạy dự án ở chế độ phát triển với tính năng tự động tải lại

## 🧰 Xử Lý Lỗi & Bảo Mật

### Xử Lý Lỗi Tập Trung

Dự án sử dụng middleware xử lý lỗi tập trung để bắt và định dạng tất cả các lỗi trong toàn bộ ứng dụng, cung cấp phản hồi lỗi nhất quán cho người dùng.

### Xác Thực & Phân Quyền

Hệ thống sử dụng JWT (JSON Web Tokens) để xác thực người dùng với hai loại token:

- **Access Token**: Thời gian ngắn (1 ngày), lưu trong cookie
- **Refresh Token**: Thời gian dài (7 ngày), cho phép làm mới access token

Middleware `authMiddleware.js` đảm nhiệm việc kiểm tra tính hợp lệ của JWT trước khi cho phép truy cập vào các endpoint được bảo vệ.

### CORS Protection

API được bảo vệ bởi chính sách CORS, chỉ cho phép các domain được chỉ định trong danh sách trắng.

## 🔄 Kết Nối Cơ Sở Dữ Liệu & Socket

### Kết Nối MongoDB

Dự án sử dụng MongoDB Atlas, một dịch vụ cơ sở dữ liệu đám mây với khả năng mở rộng cao.

Hệ thống đảm bảo kết nối an toàn và đóng kết nối đúng cách khi máy chủ tắt thông qua `async-exit-hook`.

### Kết Nối Socket.IO

Dự án tích hợp Socket.IO để cung cấp khả năng cập nhật thời gian thực, đặc biệt là cho tính năng mời người dùng tham gia bảng.

Socket lắng nghe sự kiện từ client và phát tín hiệu đến các client khác khi có thay đổi, giúp tạo trải nghiệm làm việc nhóm theo thời gian thực.

## 🔌 Tích Hợp Bên Ngoài

### Cloudinary (Image Hosting)

Cloudinary được tích hợp để lưu trữ hình ảnh như ảnh đại diện người dùng và hình ảnh đại diện cho thẻ.


