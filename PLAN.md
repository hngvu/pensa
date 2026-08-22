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
### Quy ước URL API
> **Lưu ý quan trọng về API Path:** Vì `server.servlet.context-path` đã được cấu hình sẵn là `/api` trong `application.yaml`, tất cả các endpoint trong các Controller **TUYỆT ĐỐI KHÔNG** được hardcode thêm tiền tố `/api` hay `/api/v1`. Chỉ viết đường dẫn tương đối (ví dụ: `@GetMapping("/workspaces")` hoặc `@GetMapping("/projects/{handle}")`).
### Quy ước Boundary (Ranh giới Module)
> **Lưu ý quan trọng về Service:** Các Service **TUYỆT ĐỐI KHÔNG** được gọi trực tiếp `Repository` của các module/domain khác. Ví dụ: `ProjectService` không được inject `UserRepository` hay `WorkspaceRepository`. Thay vào đó, phải gọi qua `UserService` và `WorkspaceService` để đảm bảo tính đóng gói (encapsulation) và tái sử dụng code.



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
> **Quy ước chung về `handle` (Public ID):** Bắt đầu từ Workspace trở đi, các Entity chính (Workspace, Project...) sẽ không giao tiếp với Frontend qua `UUID`. Thay vào đó, Server sẽ dùng chuỗi `handle` làm định danh công khai.
> **Cách tạo handle:** 
> - Handle là một chuỗi ngẫu nhiên dài chính xác **8 ký tự** (bao gồm chữ cái in hoa, chữ cái in thường và chữ số, VD: `A8x9K2mQ`).
> - [x] Viết một Utility class dùng `SecureRandom` để sinh chuỗi.
> - Khi tạo mới Entity (Create API), tầng Service sẽ tự động sinh handle này. Vì tính ngẫu nhiên rất cao nên **KHÔNG CẦN** dùng vòng lặp `do-while` để kiểm tra trùng lặp (existsByHandle) dưới Database nhằm tiết kiệm 1 query. Cứ sinh handle và lưu, dựa vào Unique Constraint của DB là đủ an toàn.

- [x] Tạo DTO: `WorkspaceResponse`, `WorkspaceMemberResponse`, `CreateWorkspaceRequest`, `UpdateWorkspaceRequest`, `AddWorkspaceMemberRequest`, `UpdateWorkspaceMemberRequest`.
- [x] Tạo `WorkspaceSpecification` và `WorkspaceMemberSpecification` hỗ trợ lọc động.
- [x] Tạo `WorkspaceRepository` và `WorkspaceMemberRepository` kế thừa `JpaRepository` & `JpaSpecificationExecutor`.
- [x] Xây dựng `WorkspaceService`:
  - CRUD workspace (tự động gen `handle` nếu không truyền, tự gán quyền `OWNER` cho người tạo).
  - Quản lý member: Thêm, sửa role (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`), xóa member.
- [ ] Xây dựng custom Security Bean (ví dụ `@permissionChecker`) phục vụ việc check Role bằng `@PreAuthorize`.
- [x] Tạo `WorkspaceController` sử dụng định danh Public (`handle`, `identifier`) thay vì `UUID`:
  - `GET /workspaces` & `POST /workspaces`
  - `GET /workspaces/{handle}` & `PATCH /workspaces/{handle}` & `DELETE /workspaces/{handle}`
  - `GET /workspaces/{handle}/members`
  - `POST /workspaces/{handle}/members`
  - `PATCH /workspaces/{handle}/members/{identifier}`
  - `DELETE /workspaces/{handle}/members/{identifier}`

### 2.3 Projects Module
- [ ] Tạo DTO: `ProjectResponse`, `ProjectMemberResponse`, `CreateProjectRequest`, `UpdateProjectRequest`, `AddProjectMemberRequest`, `UpdateProjectMemberRequest`.
- [x] Tạo DTO: `ProjectResponse`, `ProjectMemberResponse`, `CreateProjectRequest`, `UpdateProjectRequest`, `AddProjectMemberRequest`, `UpdateProjectMemberRequest`.
- [x] Tạo `ProjectSpecification` và `ProjectMemberSpecification` hỗ trợ lọc động.
- [x] Tạo `ProjectRepository` và `ProjectMemberRepository` kế thừa `JpaRepository` & `JpaSpecificationExecutor`.
- [x] Xây dựng `ProjectService`:
  - CRUD project (tự động gen `handle` 8 ký tự, check quyền người dùng trong Workspace chứa project đó).
  - Quản lý member: Thêm, sửa role, xóa member khỏi project.
- [x] Cập nhật Security Bean (`@permissionChecker`) để check quyền Role ở cả cấp độ Project.
- [x] Tạo `ProjectController` sử dụng định danh Public (`handle`, `identifier` thay vì `UUID`):
  - [x] `GET /workspaces/{workspaceHandle}/projects` - Lấy danh sách project.
  - [x] `POST /workspaces/{workspaceHandle}/projects` - Tạo project mới.
  - [x] `GET /projects/{projectHandle}` - Lấy chi tiết project.
  - [x] `PATCH /projects/{projectHandle}` - Cập nhật project.
  - [x] `DELETE /projects/{projectHandle}` - Xóa (soft delete) project.
  - [x] `GET /projects/{projectHandle}/members` - Lấy danh sách thành viên project.
  - [x] `POST /projects/{projectHandle}/members` - Thêm thành viên vào project.
  - [x] `PATCH /projects/{projectHandle}/members/{userId}` - Cập nhật role thành viên.
  - [x] `DELETE /projects/{projectHandle}/members/{userId}` - Xóa thành viên khỏi project.

### 2.4 Sections Module
- [x] Tạo DTO: `SectionResponse`, `CreateSectionRequest`, `UpdateSectionRequest`, `MoveSectionRequest`.
- [x] Tạo `SectionRepository`.
- [x] Xây dựng `SectionService`.
- [x] Tạo `SectionController`:
  - `GET /projects/{projectHandle}/sections`
  - `POST /projects/{projectHandle}/sections`
  - `PATCH /sections/{handle}` & `DELETE /sections/{handle}`
  - `PATCH /sections/{handle}/move`

### 2.5 Items Module (Tasks/Issues)
- [x] Tạo DTO: `ItemResponse`, `CreateItemRequest`, `UpdateItemRequest`.
- [x] Tạo `ItemRepository`.
- [x] Xây dựng `ItemService`: Tạo task, chuyển status, đổi tên, update description.
- [x] Tạo `ItemController`: API phẳng (Flat API) với Handle.
  - `GET /projects/{projectHandle}/items`
  - `POST /items` (truyền sectionHandle)
  - `GET /items/{handle}` & `PATCH /items/{handle}` & `DELETE /items/{handle}`

### 2.6 Comments & Attachments (Optional/Basic)
- [x] Tạo DTO: `CommentResponse`, `CreateCommentRequest`, `UpdateCommentRequest`.
- [x] Tạo `CommentRepository` và `CommentService`.
- [x] Tạo `CommentController` (Flat API với UUID):
  - `GET /items/{itemHandle}/comments`
  - `POST /items/{itemHandle}/comments`
  - `PATCH /comments/{id}` & `DELETE /comments/{id}`

### 2.7 Labels Module
- [x] Tạo DTO: `LabelResponse`, `CreateLabelRequest`, `UpdateLabelRequest`.
- [x] Tạo `LabelRepository` và `LabelService`.
- [x] Tạo `LabelController` (sử dụng UUID):
  - `GET /projects/{projectHandle}/labels`
  - `POST /projects/{projectHandle}/labels`
  - `PATCH /labels/{id}` & `DELETE /labels/{id}`

### 2.8 Attachments Module
- [x] Tạo DTO: `AttachmentResponse`.
- [x] Tạo `AttachmentRepository`.
- [x] Xây dựng `AttachmentService`: Xử lý upload file (Storage Cloud/S3).
- [x] Tạo `AttachmentController`:
  - `GET /items/{itemHandle}/attachments`
  - `POST /items/{itemHandle}/attachments` (hỗ trợ `multipart/form-data`)
  - `DELETE /attachments/{id}`

### 2.9 Activities (Log) Module
- [x] Tạo DTO: `ActivityResponse`.
- [x] Tạo `ActivityRepository` và `ActivitySpecification` (để filter lịch sử dễ dàng).
- [x] Xây dựng `ActivityService`: Lưu vết các thay đổi tự động (có thể dùng AOP hoặc JPA `@EntityListeners`).
- [x] Tạo `ActivityController` (Chỉ có GET vì log là read-only):
  - `GET /workspaces/{workspaceHandle}/activities` (Xem lịch sử toàn bộ workspace)
  - `GET /projects/{projectHandle}/activities` (Xem lịch sử toàn project)
  - `GET /items/{itemHandle}/activities` (Xem lịch sử của 1 task cụ thể)

### 2.10 Cross-cutting
- [x] **GlobalExceptionHandler**: Bắt và chuẩn hóa lỗi (400, 401, 403, 404, 500) trả về theo dạng ProblemDetail (RFC 9457).

### 2.11 Background Jobs (Schedulers)
- [ ] **LexoRank Rebalancing Service**: Viết Cron Job (ví dụ: chạy ngầm mỗi đêm lúc 2h sáng `@Scheduled(cron = "0 0 2 * * ?")`).
  - Nhiệm vụ: Quét toàn bộ `Section` và `Item` trong các Project đang active.
  - Phân bổ lại chuỗi `lexoRank` cho ngắn gọn, cách đều nhau (ví dụ từ chuỗi bị dài `a1b2c3d4` đưa về dạng chuẩn `a`, `b`, `c`...).
  - Mục đích: Tránh tình trạng độ dài chuỗi rank bị phình to vô hạn làm giảm hiệu năng lưu trữ và tính toán của thuật toán kéo thả.

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

## Future Enhancements (Backlog)
- [ ] Th�m s? th? t? (sequence_number) t? tang v�o Item slug d? gi?ng Trello (v� d?: 123-ten-the).
