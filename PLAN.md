# Pensa - Kế hoạch triển khai (Action Plan)

## Phase 1: Database & Configuration
- [x] Viết `application.yaml` & `application-dev.yaml` (DB, JPA, Flyway, JWT, WebSocket, Origin).
- [x] Cấu hình SpringDoc OpenAPI (Swagger UI) cho document API.
- [x] Bổ sung trường `clerkId` (String, unique) vào entity `User` để lưu ID đồng bộ từ Clerk (ví dụ: `user_2c3...`).
- [x] Cập nhật `SecurityConfig.java` và `SecurityUtils`: 
  - **Xử lý Clerk JWT:** Giá trị `sub` trong JWT của Clerk là `clerkId` (String) chứ không phải UUID nội bộ.
  - Cần viết `JwtAuthenticationConverter` (hoặc Filter) để parse `sub` (ClerkID), map sang `UUID` nội bộ của bảng `users` (query DB hoặc dùng Cache/Custom Claim).
  - Đảm bảo `SecurityContext` và `JpaAuditConfig` vẫn luôn nhận được `UUID` để giữ nguyên hiệu năng lưu vết (Audit) và toàn vẹn dữ liệu cho các bảng khác.
- [x] Viết `WebSocketConfig.java` (STOMP broker).

## Phase 2: Backend API Core (Controllers, Services, Repositories, DTOs)

### 2.1 Users Module
- [x] Tạo các DTO `UserResponse`, `CreateUserRequest`, `UpdateUserRequest` 
- [x] Tạo `UserSpecification` để lọc động (dynamic filtering) theo `email`, `username`, `fullName`, `status`, `workspaceid`, `projectid`.
- [x] Tạo `UserRepository` kế thừa `JpaRepository` và `JpaSpecificationExecutor`.
- [x] Xây dựng `UserService`: Xử lý CRUD cơ bản và logic obfuscate `username`/`email` khi soft delete.
- [x] Tạo `UserController` expose các API:
  - `GET /users/me` & `PATCH /users/me`: Quản lý profile cá nhân.
  - `GET /users`: Tìm kiếm nâng cao có phân trang.
  - `GET /users/{identifier}`: Lấy profile người khác qua email hoặc username.
  - `POST /users`: Admin tạo mới user.
  - `DELETE /users/{userId}`: Xóa tài khoản (soft delete).

### 2.2 Workspaces Module
- [ ] `GET /workspaces` - Lấy danh sách workspace của user.
- [ ] `POST /workspaces` - Tạo workspace mới.
- [ ] `GET /workspaces/{workspaceId}` - Lấy chi tiết workspace.
- [ ] `PATCH /workspaces/{workspaceId}` - Cập nhật thông tin workspace.
- [ ] `DELETE /workspaces/{workspaceId}` - Xóa (soft delete) workspace.
- [ ] `GET /workspaces/{workspaceId}/members` - Lấy danh sách thành viên.
- [ ] `POST /workspaces/{workspaceId}/members` - Thêm thành viên vào workspace.
- [ ] `PATCH /workspaces/{workspaceId}/members/{userId}` - Thay đổi role của thành viên.
- [ ] `DELETE /workspaces/{workspaceId}/members/{userId}` - Xóa thành viên khỏi workspace.

### 2.3 Projects Module
- [ ] `GET /workspaces/{workspaceId}/projects` - Lấy danh sách project.
- [ ] `POST /workspaces/{workspaceId}/projects` - Tạo project mới.
- [ ] `GET /projects/{projectId}` - Lấy chi tiết project.
- [ ] `PATCH /projects/{projectId}` - Cập nhật project.
- [ ] `DELETE /projects/{projectId}` - Xóa (soft delete) project.
- [ ] `GET /projects/{projectId}/members` - Lấy danh sách thành viên project.
- [ ] `POST /projects/{projectId}/members` - Thêm thành viên vào project.
- [ ] `PATCH /projects/{projectId}/members/{userId}` - Cập nhật role thành viên.
- [ ] `DELETE /projects/{projectId}/members/{userId}` - Xóa thành viên khỏi project.

### 2.4 Sections Module
- [ ] `GET /projects/{projectId}/sections` - Lấy danh sách sections.
- [ ] `POST /projects/{projectId}/sections` - Tạo section mới.
- [ ] `PATCH /sections/{sectionId}` - Đổi tên, thay đổi thứ tự (position) của section.
- [ ] `DELETE /sections/{sectionId}` - Xóa section (kéo theo xóa items bên trong).

### 2.5 Items (Tasks) Module
- [ ] `GET /projects/{projectId}/items` - Lấy danh sách items (có hỗ trợ filter, sort, pagination).
- [ ] `POST /sections/{sectionId}/items` - Tạo item mới.
- [ ] `GET /items/{itemId}` - Lấy chi tiết item.
- [ ] `PATCH /items/{itemId}` - Cập nhật item (title, description, status, priority, assignee, dueDate).
- [ ] `DELETE /items/{itemId}` - Xóa (soft delete) item.
- [ ] `PATCH /items/{itemId}/move` - Chuyển item sang section khác và/hoặc đổi thứ tự (position).

### 2.6 Comments & Reactions Module
- [ ] `GET /items/{itemId}/comments` - Lấy danh sách comment của item.
- [ ] `POST /items/{itemId}/comments` - Đăng comment mới.
- [ ] `PATCH /comments/{commentId}` - Sửa nội dung comment.
- [ ] `DELETE /comments/{commentId}` - Xóa (soft delete) comment.
- [ ] `POST /reactions` - Toggle reaction (thêm/xóa emoji trên comment hoặc item).

### 2.7 Labels Module
- [ ] `GET /projects/{projectId}/labels` - Lấy danh sách label của project.
- [ ] `POST /projects/{projectId}/labels` - Tạo label mới.
- [ ] `PATCH /labels/{labelId}` - Đổi tên, đổi màu label.
- [ ] `DELETE /labels/{labelId}` - Xóa label.
- [ ] `POST /items/{itemId}/labels/{labelId}` - Gán label cho item.
- [ ] `DELETE /items/{itemId}/labels/{labelId}` - Gỡ label khỏi item.

### 2.8 Attachments Module
- [ ] `GET /items/{itemId}/attachments` - Lấy danh sách file đính kèm.
- [ ] `POST /items/{itemId}/attachments` - Upload file (multipart/form-data).
- [ ] `DELETE /attachments/{attachmentId}` - Xóa file đính kèm.

### 2.9 Activities (Log) Module
- [ ] `GET /projects/{projectId}/activities` - Lấy lịch sử hoạt động của project.
- [ ] `GET /items/{itemId}/activities` - Lấy lịch sử hoạt động của 1 item cụ thể.

### 2.10 Cross-cutting
- [ ] **GlobalExceptionHandler**: Bắt và chuẩn hóa lỗi (400, 401, 403, 404, 500) trả về theo dạng ProblemDetail (RFC 9457).

## Phase 3: Frontend MVP
- [ ] Setup các thư viện cần thiết: `react-router-dom`, `@tanstack/react-query`, `axios`, `@dnd-kit`.
- [ ] Setup API Client: Axios instance kèm JWT Interceptor.
- [ ] Xây dựng bộ Routing & App Layout (Sidebar, Header, Main Content).
- [ ] Tích hợp luồng đăng nhập OAuth2 (xử lý Callback, lưu token).
- [ ] Xây dựng trang danh sách Workspace & Project.
- [ ] Xây dựng trang Kanban Board (`ProjectBoardPage`): Có Drag & Drop, tạo nhanh task.
- [ ] Xây dựng Modal chi tiết Item (`ItemDetailPage`): Hiển thị mô tả, comment, activity, v.v.
- [ ] Hoàn thiện các UI components dùng chung (Avatar, Status Badge, Comment Editor).

## Phase 4: Real-time Collaboration & Testing
- [ ] Frontend: Viết hook `useWebSocket` để nhận event và invalidate cache (cập nhật giao diện realtime).
- [ ] Backend: Viết Unit tests cho Services.
- [ ] Backend: Viết Integration tests cho Controllers.
- [ ] Frontend: Viết Component & Hook tests cơ bản.

## Phase 5: DevOps & Deployment (Optional)
- [ ] Viết `Dockerfile` cho Backend và Frontend.
- [ ] Viết `docker-compose.yml` chạy full stack (API, Web, PostgreSQL).
- [ ] Setup CI/CD (GitHub Actions).
