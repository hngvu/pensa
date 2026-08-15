# PLAN.md — Comprehensive Development Plan for Pensa

> **Last Updated:** 2026-08-15  
> **Status:** In Development — Phase 0 Complete (Entity layer)

---

## 1. Project Overview

**Pensa** is a full-stack **project management** application inspired by Linear/Asana. Users can organize work hierarchically: Workspace → Project → Section → Item (task), with full collaboration features such as comments, labels, attachments, and an activity log.

### Tech Stack

| Layer | Technology | Version |
|------|-----------|-----------|
| Backend | Java + Spring Boot | Java 21, Spring Boot 4.1 |
| ORM | Hibernate / Spring Data JPA | — |
| DB Migration | Flyway | PostgreSQL driver |
| Security | Spring Security + OAuth2 Resource Server (JWT) | — |
| Real-time | Spring WebSocket (STOMP) | — |
| API Docs | SpringDoc OpenAPI | 3.1.0 |
| Frontend | React + TypeScript + Vite | React 19, TS ~6.0, Vite 8 |
| Linting | oxlint | 1.75 |
| Database | PostgreSQL | — |

---

## 2. As-Is Analysis

### 2.1 Backend — What's Implemented

| File | Description | Status |
|------|-------|-----------|
| `common/BaseEntity.java` | UUID time-based, `@Version` optimistic lock | ✅ Complete |
| `common/AuditableEntity.java` | `createdAt`, `updatedAt`, `createdBy`, `lastModifiedBy` | ✅ Complete |
| `common/SoftDeletableEntity.java` | `deletedAt`, `deletedBy`, `markDeleted()`, `restore()` | ✅ Complete |
| `common/JpaAuditConfig.java` | `AuditorAware` reads UUID from JWT subject | ✅ Complete |
| `workspaces/Workspace.java` | Entity: name, slug, description, avatarUrl, ownerId, planType | ✅ Entity Complete |
| `workspaces/WorkspaceMember.java` | Join table: workspaceId, userId, role | ✅ Entity Complete |
| `workspaces/WorkspaceRole.java` | Enum role | ✅ Complete |
| `projects/Project.java` | Entity: workspaceId, name, key, description, iconUrl, leadId, issueCounter | ✅ Entity Complete |
| `projects/ProjectMember.java` | Join table: projectId, userId, role | ✅ Entity Complete |
| `projects/ProjectRole.java` | Enum role | ✅ Complete |
| `sections/Section.java` | Entity: projectId, name, position | ✅ Entity Complete |
| `items/Item.java` | Entity: projectId, sectionId, parentItemId, title, description, position, isCompleted | ✅ Entity Complete |
| `comments/Comment.java` | Entity: itemId, authorId, parentCommentId, content, isEdited | ✅ Entity Complete |
| `comments/Reaction.java` | Entity: userId, targetType, targetId, emoji — unique constraint | ✅ Entity Complete |
| `comments/ReactionTargetType.java` | Enum | ✅ Complete |
| `labels/Label.java` | Entity: projectId, name, color — unique(project+name) | ✅ Entity Complete |
| `labels/ItemLabel.java` | Join table: itemId, labelId, createdAt | ✅ Entity Complete |
| `attachments/Attachment.java` | Entity: itemId, uploaderId, fileName, fileSize, contentType, storagePath, checksum | ✅ Entity Complete |
| `activities/ActivityLog.java` | Immutable log: workspaceId, projectId, entityType, entityId, actorId, actionType, fieldName, oldValue, newValue | ✅ Entity Complete |
| `activities/ActivityActionType.java` | Enum: CREATED, UPDATED, DELETED, STATUS_CHANGED, ASSIGNEE_CHANGED, PRIORITY_CHANGED | ✅ Complete |
| `activities/ActivityEntityType.java` | Enum: WORKSPACE, PROJECT, SECTION, ITEM, LABEL, COMMENT, ATTACHMENT | ✅ Complete |

### 2.2 Backend — What's Missing

- ❌ No **Flyway migration SQLs** (`db/migration/` folder is empty)
- ❌ No **Repositories** for any entities
- ❌ No **Services**
- ❌ No **Controllers**
- ❌ No **DTOs** (Request/Response)
- ❌ No **Spring Security** configuration (SecurityFilterChain)
- ❌ No **WebSocket / STOMP** configuration
- ❌ `application.yaml` only contains `spring.application.name=api` (missing DB config, JWT config, etc.)
- ❌ Item entity is missing critical business fields: `assigneeId`, `priority`, `dueDate`, `status`, `issueNumber`
- ❌ `AuditableEntity` stores `lastModifiedBy` instead of `updatedBy` (inconsistent with AGENTS.md)

### 2.3 Frontend — What's Implemented

- ✅ Vite + React 19 + TypeScript 6 setup
- ✅ `index.css` with basic design tokens (colors, fonts, dark mode)
- ❌ `App.tsx` is currently the default Vite boilerplate — no real UI yet
- ❌ No routing, pages, components, or API layer

---

## 3. Detailed Domain Model

### 3.1 Data Hierarchy

```
Workspace
  ├── WorkspaceMember (N users with roles: OWNER | ADMIN | MEMBER | GUEST)
  └── Project
        ├── ProjectMember (N users with roles: MANAGER | MEMBER | VIEWER)
        ├── Label (name + color, unique per project)
        └── Section (has position for drag-and-drop)
              └── Item (task/issue)
                    ├── Item (sub-task, self-ref via parentItemId)
                    ├── Comment
                    │     └── Comment (reply, via parentCommentId)
                    ├── Reaction (on Comment or Item)
                    ├── Attachment
                    ├── ItemLabel (multiple labels per item)
                    └── ActivityLog (immutable audit trail)
```

### 3.2 Item — Additional Fields Required

The current Item entity lacks several important project management fields:

| Field | Type | Description |
|-------|------|-------|
| `issueNumber` | `Integer` | Auto-incremented issue number per project (PROJECT-1, PROJECT-2, ...) |
| `status` | `String` (Enum) | TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED |
| `priority` | `String` (Enum) | URGENT, HIGH, MEDIUM, LOW, NO_PRIORITY |
| `assigneeId` | `UUID` | The user assigned to the item |
| `dueDate` | `LocalDate` | Due date |
| `startDate` | `LocalDate` | Start date |
| `estimatePoints` | `Integer` | Story points |

---

## 4. Database Schema Design

### 4.1 Flyway Migration Order

```
V1__create_users_table.sql
V2__create_workspaces_table.sql
V3__create_workspace_members_table.sql
V4__create_projects_table.sql
V5__create_project_members_table.sql
V6__create_sections_table.sql
V7__create_items_table.sql
V8__create_comments_table.sql
V9__create_reactions_table.sql
V10__create_labels_table.sql
V11__create_item_labels_table.sql
V12__create_attachments_table.sql
V13__create_activity_logs_table.sql
```

### 4.2 Sample Schema for Core Tables

```sql
-- V7__create_items_table.sql
CREATE TABLE items (
    id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    version          BIGINT      NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       UUID        REFERENCES users(id),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID        REFERENCES users(id),
    deleted_at       TIMESTAMPTZ,
    deleted_by       UUID        REFERENCES users(id),

    project_id       UUID        NOT NULL REFERENCES projects(id),
    section_id       UUID        NOT NULL REFERENCES sections(id),
    parent_item_id   UUID        REFERENCES items(id),
    assignee_id      UUID        REFERENCES users(id),

    issue_number     INTEGER     NOT NULL,
    title            TEXT        NOT NULL,
    description      TEXT,
    status           VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority         VARCHAR(20) NOT NULL DEFAULT 'NO_PRIORITY',
    position         TEXT        NOT NULL,
    is_completed     BOOLEAN     NOT NULL DEFAULT FALSE,
    due_date         DATE,
    start_date       DATE,
    estimate_points  INTEGER,

    UNIQUE (project_id, issue_number)
);

CREATE INDEX idx_items_project_id ON items(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_items_section_id ON items(section_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_items_assignee_id ON items(assignee_id) WHERE deleted_at IS NULL;
```

---

## 5. REST API Design

### 5.1 Endpoint Overview

**Base URL:** `http://localhost:8080/api/v1`

#### Auth (delegated to OAuth2 Provider)
> No login endpoint — the server only validates JWT Bearer tokens.
> The User record is created/updated upon the first successful authentication (OIDC userinfo sync).

#### Users
| Method | Path | Description |
|--------|------|-------|
| GET | `/users/me` | Get current user's profile |
| PATCH | `/users/me` | Update profile (displayName, avatarUrl) |

#### Workspaces
| Method | Path | Description |
|--------|------|-------|
| GET | `/workspaces` | List user's workspaces |
| POST | `/workspaces` | Create a new workspace |
| GET | `/workspaces/{workspaceId}` | Workspace details |
| PATCH | `/workspaces/{workspaceId}` | Update workspace |
| DELETE | `/workspaces/{workspaceId}` | Soft delete workspace |
| GET | `/workspaces/{workspaceId}/members` | List members |
| POST | `/workspaces/{workspaceId}/members` | Add member (invite by email) |
| PATCH | `/workspaces/{workspaceId}/members/{userId}` | Change member role |
| DELETE | `/workspaces/{workspaceId}/members/{userId}` | Remove member |

#### Projects
| Method | Path | Description |
|--------|------|-------|
| GET | `/workspaces/{workspaceId}/projects` | List projects in workspace |
| POST | `/workspaces/{workspaceId}/projects` | Create a new project |
| GET | `/projects/{projectId}` | Project details |
| PATCH | `/projects/{projectId}` | Update project |
| DELETE | `/projects/{projectId}` | Soft delete project |
| GET | `/projects/{projectId}/members` | List project members |
| POST | `/projects/{projectId}/members` | Add member |
| PATCH | `/projects/{projectId}/members/{userId}` | Change member role |
| DELETE | `/projects/{projectId}/members/{userId}` | Remove member |

#### Sections
| Method | Path | Description |
|--------|------|-------|
| GET | `/projects/{projectId}/sections` | List sections |
| POST | `/projects/{projectId}/sections` | Create a section |
| PATCH | `/projects/{projectId}/sections/{sectionId}` | Rename / reorder |
| DELETE | `/projects/{projectId}/sections/{sectionId}` | Soft delete section |

#### Items
| Method | Path | Description |
|--------|------|-------|
| GET | `/projects/{projectId}/items` | List items (filter: sectionId, assigneeId, status, priority, label) |
| POST | `/projects/{projectId}/sections/{sectionId}/items` | Create an item |
| GET | `/items/{itemId}` | Item details |
| PATCH | `/items/{itemId}` | Update an item |
| DELETE | `/items/{itemId}` | Soft delete item |
| PATCH | `/items/{itemId}/move` | Move item to another section / reorder |

#### Comments
| Method | Path | Description |
|--------|------|-------|
| GET | `/items/{itemId}/comments` | List comments (threaded) |
| POST | `/items/{itemId}/comments` | Post a comment |
| PATCH | `/comments/{commentId}` | Edit a comment |
| DELETE | `/comments/{commentId}` | Soft delete comment |

#### Reactions
| Method | Path | Description |
|--------|------|-------|
| POST | `/reactions` | Toggle reaction (add if absent, remove if present) |

#### Labels
| Method | Path | Description |
|--------|------|-------|
| GET | `/projects/{projectId}/labels` | List labels |
| POST | `/projects/{projectId}/labels` | Create a label |
| PATCH | `/labels/{labelId}` | Update a label |
| DELETE | `/labels/{labelId}` | Delete a label |
| POST | `/items/{itemId}/labels/{labelId}` | Assign label to item |
| DELETE | `/items/{itemId}/labels/{labelId}` | Remove label from item |

#### Attachments
| Method | Path | Description |
|--------|------|-------|
| GET | `/items/{itemId}/attachments` | List attachments |
| POST | `/items/{itemId}/attachments` | Upload a file (multipart/form-data) |
| DELETE | `/attachments/{attachmentId}` | Soft delete attachment |

#### Activities
| Method | Path | Description |
|--------|------|-------|
| GET | `/projects/{projectId}/activities` | Activity log for a project |
| GET | `/items/{itemId}/activities` | Activity log for an item |

### 5.2 Standard Response Format

```json
// Success — single resource
{
  "id": "018f...",
  "name": "My Workspace",
  "slug": "my-workspace",
  "createdAt": "2026-08-15T10:00:00Z"
}

// Success — paginated list
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}

// Error — ProblemDetail (RFC 9457)
{
  "type": "https://api.pensa.app/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Workspace with id '...' not found",
  "instance": "/api/v1/workspaces/..."
}
```

---

## 6. Security Design

### 6.1 Authentication Flow

```
[Client]  →  [OAuth2 Provider (Keycloak/Auth0)]
    ↓ JWT Access Token (Bearer)
[Pensa API]  →  validate JWT signature & claims
    ↓ JWT subject (UUID) = userId
[JpaAuditConfig]  →  AuditorAware returns userId from SecurityContext
```

### 6.2 Authorization Matrix

| Action | GUEST | MEMBER | ADMIN | OWNER |
|--------|-------|--------|-------|-------|
| Read workspace | ✅ | ✅ | ✅ | ✅ |
| Create project | ❌ | ✅ | ✅ | ✅ |
| Invite workspace members | ❌ | ❌ | ✅ | ✅ |
| Change member roles | ❌ | ❌ | ✅ | ✅ |
| Delete workspace | ❌ | ❌ | ❌ | ✅ |

| Action | VIEWER | MEMBER | MANAGER |
|--------|--------|--------|---------|
| Read project | ✅ | ✅ | ✅ |
| Create/edit item | ❌ | ✅ | ✅ |
| Delete item | ❌ | ✅* | ✅ |
| Manage members | ❌ | ❌ | ✅ |
| Delete project | ❌ | ❌ | ✅ |

> \* Members can only delete items they have created themselves.

### 6.3 SecurityFilterChain Setup

```java
// Will be created in common/SecurityConfig.java
// - Disable CSRF (stateless JWT API)
// - Permit: GET /actuator/health, OPTIONS (CORS preflight)
// - Authenticate: all other endpoints
// - JWT decoder: validate signature with JWK Set from issuer
// - CORS: allow origin http://localhost:5173
```

---

## 7. Real-time Design (WebSocket)

### 7.1 STOMP Topic Design

```
/topic/workspaces/{workspaceId}          <- broadcast to entire workspace
/topic/projects/{projectId}              <- broadcast to entire project
/topic/items/{itemId}                    <- realtime updates on detail view
/user/queue/notifications                <- personal notifications
```

### 7.2 Emitted Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `item.created` | POST /items | ItemResponse |
| `item.updated` | PATCH /items/{id} | ItemResponse |
| `item.deleted` | DELETE /items/{id} | `{ "id": "..." }` |
| `item.moved` | PATCH /items/{id}/move | ItemResponse |
| `comment.created` | POST /comments | CommentResponse |
| `comment.updated` | PATCH /comments/{id} | CommentResponse |
| `reaction.toggled` | POST /reactions | ReactionResponse |

---

## 8. Frontend Architecture

### 8.1 Proposed Directory Structure

```
web/src/
├── main.tsx
├── App.tsx                    # Root + Router setup
├── index.css                  # Global design tokens
│
├── api/                       # Axios client + API functions
│   ├── client.ts              # Axios instance with JWT interceptor
│   ├── workspaces.ts
│   ├── projects.ts
│   ├── sections.ts
│   ├── items.ts
│   ├── comments.ts
│   └── labels.ts
│
├── types/                     # TypeScript interfaces mirroring API DTOs
│   ├── workspace.ts
│   ├── project.ts
│   ├── item.ts
│   └── ...
│
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts             # JWT + user context
│   ├── useWorkspace.ts
│   ├── useProject.ts
│   ├── useItems.ts
│   └── useWebSocket.ts        # STOMP client
│
├── components/                # Reusable UI components
│   ├── ui/                    # Atoms (Button, Input, Badge, Avatar, ...)
│   ├── layout/                # AppShell, Sidebar, Header
│   └── domain/                # ItemCard, CommentThread, LabelBadge, ...
│
└── pages/                     # Route-level components
    ├── auth/
    │   └── CallbackPage.tsx   # OAuth2 callback handler
    ├── workspace/
    │   ├── WorkspaceListPage.tsx
    │   └── WorkspaceSettingsPage.tsx
    ├── project/
    │   ├── ProjectBoardPage.tsx      # Kanban view
    │   ├── ProjectListPage.tsx       # List view
    │   └── ProjectSettingsPage.tsx
    └── item/
        └── ItemDetailPage.tsx        # Modal / Drawer
```

### 8.2 State Management

- **Server state:** Use **TanStack Query (React Query v5)** for caching, invalidation, and optimistic updates.
- **Client state:** React Context for auth/user and current workspace.
- **Real-time:** WebSocket events will invalidate or directly mutate the TanStack Query cache.

### 8.3 Routing (React Router v7)

```
/                                         -> redirect -> /workspaces
/workspaces                               -> WorkspaceListPage
/workspaces/:slug                         -> WorkspacePage (list projects)
/workspaces/:slug/settings                -> WorkspaceSettingsPage
/:workspaceSlug/:projectKey               -> ProjectBoardPage (Default Kanban)
/:workspaceSlug/:projectKey/list          -> ProjectListPage
/:workspaceSlug/:projectKey/settings      -> ProjectSettingsPage
/:workspaceSlug/:projectKey/issues/:num   -> ItemDetailPage (modal overlay)
/auth/callback                            -> OAuth2CallbackPage
```

### 8.4 Additional Dependencies Needed

```json
{
  "dependencies": {
    "react-router-dom": "^7.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "@stomp/stompjs": "^7.x",
    "sockjs-client": "^1.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x"
  }
}
```

---

## 9. Development Roadmap (Phases)

### Phase 0 — Foundation ✅ COMPLETE

- [x] Initialize monorepo (api/ + web/)
- [x] Define all Entity classes with the correct inheritance chain
- [x] Configure JpaAuditConfig + AuditorAware from JWT
- [x] Implement soft delete pattern (`@SQLDelete` + `@SQLRestriction`)
- [x] Setup Vite + React 19 + TypeScript 6
- [x] Basic design tokens in `index.css`

---

### Phase 1 — Database & Infrastructure 🔲 UP NEXT

**Goal:** A working dev environment and ready DB schema.

**Backend tasks:**
- [ ] Add missing fields to `Item.java`: `status`, `priority`, `assigneeId`, `issueNumber`, `dueDate`, `startDate`, `estimatePoints`
- [ ] Add `ItemStatus.java` and `ItemPriority.java` enums to the `items/` package
- [ ] Fix `AuditableEntity.java`: rename `lastModifiedBy` -> `updatedBy` for consistency (or update AGENTS.md)
- [ ] Write all 13 Flyway migration SQLs (V1 -> V13)
- [ ] Fully configure `application.yaml`: datasource, JPA/Hibernate, Flyway, JWT, CORS, WebSocket
- [ ] Create `application-local.yaml` (in .gitignore) for dev credentials
- [ ] Create `SecurityConfig.java` with SecurityFilterChain (JWT + CORS + stateless)
- [ ] Create `WebSocketConfig.java` with STOMP endpoint `/ws` and a message broker

**Priority Order:**
1. `application.yaml` + `application-local.yaml`
2. `SecurityConfig.java`
3. Flyway migrations V1 -> V13
4. Verify: `mvnw spring-boot:run` runs without errors, schema is correctly created

---

### Phase 2 — Core Backend API 🔲

**Goal:** All CRUD APIs working and testable via Postman/curl.

**Implementation order by domain (dependency order):**

#### 2.1 Users domain
- [ ] `UserRepository extends JpaRepository<User, UUID>`
- [ ] `UserService`: `findOrCreateByJwt()`, `getById()`, `updateProfile()`
- [ ] `UserController`: `GET /users/me`, `PATCH /users/me`
- [ ] `UserRequest.java`, `UserResponse.java`

#### 2.2 Workspaces domain
- [ ] `WorkspaceRepository`, `WorkspaceMemberRepository`
- [ ] `WorkspaceService`: CRUD + member management + authorization check
- [ ] `WorkspaceController`: 9 endpoints
- [ ] `WorkspaceRequest.java`, `WorkspaceResponse.java`, `WorkspaceMemberResponse.java`

#### 2.3 Projects domain
- [ ] `ProjectRepository`, `ProjectMemberRepository`
- [ ] `ProjectService`: CRUD + member management + issueCounter increment
- [ ] `ProjectController`: 9 endpoints
- [ ] Corresponding DTOs

#### 2.4 Sections domain
- [ ] `SectionRepository`
- [ ] `SectionService`: CRUD + reorder (position fractional indexing)
- [ ] `SectionController`: 4 endpoints
- [ ] Corresponding DTOs

#### 2.5 Items domain (Most complex)
- [ ] `ItemRepository` with custom queries: filter by status, priority, assignee, label
- [ ] `ItemService`:
  - Create item: auto-increment issueNumber, assign position
  - Full CRUD
  - Move item: update sectionId + position
  - Emit WebSocket events after each mutation
  - Auto-record ActivityLog when critical fields update
- [ ] `ItemController`: 6 endpoints
- [ ] `ItemRequest.java`, `ItemResponse.java` (including labels, assignee info)

#### 2.6 Comments domain
- [ ] `CommentRepository`, `ReactionRepository`
- [ ] `CommentService`: CRUD + authorize (only author can edit/delete)
- [ ] `CommentController`: 4 comment endpoints + reaction toggle
- [ ] Corresponding DTOs

#### 2.7 Labels domain
- [ ] `LabelRepository`, `ItemLabelRepository`
- [ ] `LabelService`: CRUD + assign/unassign label to item
- [ ] `LabelController`: 6 endpoints
- [ ] Corresponding DTOs

#### 2.8 Attachments domain
- [ ] `AttachmentRepository`
- [ ] `AttachmentService`: upload (local disk or S3), soft delete, serve URL
- [ ] `AttachmentController`: 3 endpoints
- [ ] Corresponding DTOs

#### 2.9 Activities domain
- [ ] `ActivityLogRepository`
- [ ] `ActivityLogService`: only `create()` and `findBy*()`, no update/delete
- [ ] `ActivityLogController`: 2 GET endpoints

#### 2.10 Cross-cutting: Error Handling
- [ ] `GlobalExceptionHandler.java` (`@ControllerAdvice`)
  - `EntityNotFoundException` -> 404 ProblemDetail
  - `AccessDeniedException` -> 403 ProblemDetail
  - `OptimisticLockException` -> 409 ProblemDetail
  - `ConstraintViolationException` -> 422 ProblemDetail
  - Generic Exception -> 500 ProblemDetail

---

### Phase 3 — Frontend MVP 🔲

**Goal:** Users can log in, view workspaces/projects, create and manage items.

#### 3.1 Setup infrastructure
- [ ] Install additional dependencies: react-router-dom, @tanstack/react-query, axios
- [ ] `api/client.ts`: Axios instance, request interceptor attaching JWT, response interceptor handling 401
- [ ] `hooks/useAuth.ts`: Read JWT from localStorage/memory, expose user info
- [ ] Setup QueryClientProvider + RouterProvider in `main.tsx`
- [ ] Remove boilerplate in `App.tsx`, define routes

#### 3.2 Auth flow
- [ ] Redirect to OAuth2 provider login
- [ ] `CallbackPage.tsx`: receive authorization code, exchange token, save JWT, redirect back
- [ ] Protect routes using a wrapper component

#### 3.3 Layout & Navigation
- [ ] `AppShell.tsx`: Left Sidebar (workspaces, projects) + main content area
- [ ] `Sidebar.tsx`: workspace switcher, project list, navigation links
- [ ] `Header.tsx`: breadcrumbs, user avatar, actions

#### 3.4 Pages
- [ ] `WorkspaceListPage.tsx`: List workspaces, create new
- [ ] `ProjectBoardPage.tsx` (Kanban):
  - Column = Section, Card = Item
  - Drag-and-drop via `@dnd-kit`
  - Inline quick create item
- [ ] `ProjectListPage.tsx` (Table):
  - Table with columns: #, Title, Status, Priority, Assignee, Due Date, Labels
  - Sort, filter, groupBy
- [ ] `ItemDetailPage.tsx` (Modal/Drawer):
  - Full details: title, description (rich text), status, priority, assignee, labels, due date
  - Comment thread
  - Activity log
  - Attachment list

#### 3.5 Reusable components
- [ ] `StatusBadge.tsx`: colored badge based on status
- [ ] `PriorityIcon.tsx`: icon based on priority
- [ ] `UserAvatar.tsx`: avatar + tooltip
- [ ] `LabelBadge.tsx`: chip with label color
- [ ] `ItemCard.tsx`: card for the Kanban board
- [ ] `CommentEditor.tsx`: textarea with emoji picker
- [ ] `DatePicker.tsx`: date selection component

---

### Phase 4 — Real-time Collaboration 🔲

**Goal:** Multiple users viewing the same project see real-time updates.

- [ ] `WebSocketConfig.java`: STOMP configuration, message broker (in-memory or RabbitMQ)
- [ ] Inject `SimpMessagingTemplate` into `ItemService` to broadcast after mutations
- [ ] Frontend: `useWebSocket.ts` — STOMP connection, topic subscription via projectId
- [ ] On event: invalidate or mutate the corresponding TanStack Query cache
- [ ] Display "viewing avatars" (presence) — optional

---

### Phase 5 — Testing 🔲

**Goal:** Ensure quality and prevent regressions.

#### Backend
- [ ] Unit tests for `*Service.java` (mocking repositories)
- [ ] Integration tests for `*Controller.java` using `@SpringBootTest` + `@AutoConfigureMockMvc`
- [ ] Repository tests using `@DataJpaTest` + TestContainers (PostgreSQL)
- [ ] Security tests: no JWT -> 401, incorrect role -> 403

#### Frontend
- [ ] Setup Vitest + React Testing Library
- [ ] Unit tests for hooks (useItems, useWorkspace)
- [ ] Component tests for ItemCard, CommentEditor
- [ ] E2E with Playwright: happy path (create workspace -> project -> item)

---

### Phase 6 — Polish & DevOps 🔲

**Goal:** Production-ready.

- [ ] `Dockerfile` for both `api/` and `web/`
- [ ] `docker-compose.yml`: api + web + postgres + (optional) keycloak
- [ ] GitHub Actions CI: build + test + lint on every PR
- [ ] Pagination + cursor-based pagination for item lists
- [ ] Full-text search for item title/description
- [ ] File upload: migrate from local disk to S3-compatible storage
- [ ] API Rate limiting
- [ ] Observability: Actuator metrics + Micrometer + Grafana

---

## 10. Technical Conventions

### 10.1 Fractional Indexing for Positioning

Instead of an `INTEGER` position (which causes full re-indexing on drag-and-drop), use a **`TEXT` lexicographic ordering**:

```
Example: "a0", "a1", "a2" -> drag item 3 to the top -> position = "Zz" (before "a0")
Insert an item between "a0" and "a1" -> position = "a0V"
```

Reference library: `fractional-indexing` (JS) or implement the algorithm manually.

### 10.2 Issue Number per Project

```java
// Inside ItemService.createItem():
@Transactional
public Item createItem(...) {
    // Pessimistic lock to prevent race conditions
    Project project = projectRepository.findByIdWithLock(projectId);
    int issueNumber = project.getIssueCounter() + 1;
    project.setIssueCounter(issueNumber);
    projectRepository.save(project);

    Item item = new Item();
    item.setIssueNumber(issueNumber);
    // ...
}
```

### 10.3 ActivityLog — Change Logging

```java
// Inside ItemService.updateItem() — after save:
if (!Objects.equals(oldStatus, newStatus)) {
    activityLogService.log(ActivityLog.builder()
        .entityType(ActivityEntityType.ITEM)
        .entityId(item.getId())
        .actionType(ActivityActionType.STATUS_CHANGED)
        .fieldName("status")
        .oldValue(oldStatus.name())
        .newValue(newStatus.name())
        .build());
}
```

### 10.4 Cascading Soft Deletes

When deleting a `Section`:
1. Fetch all `Item`s belonging to the section.
2. Soft delete each `Item` (which triggers cascading soft deletes for Comments, Attachments).
3. Soft delete the `Section`.

> **Do not** use `ON DELETE CASCADE` in the DB — control it via application logic to ensure the `ActivityLog` is properly recorded.

---

## 11. Open Questions / Pending Decisions

| # | Question | Impact |
|---|---------|---------|
| 1 | Which OAuth2 Provider? (Self-hosted Keycloak, Auth0, Google OIDC) | Affects SecurityConfig JWT issuer and callback URL |
| 2 | Attachment storage: local disk (dev only) or S3-compatible from the start? | Affects AttachmentService, config, docker-compose |
| 3 | Message broker for WebSocket: in-memory or RabbitMQ/Redis? | In-memory is OK for single node; an external broker is needed to scale horizontally |
| 4 | Pagination: offset-based (simpler) or cursor-based (better performance for realtime)? | Affects Repository queries and Response schema |
| 5 | Rich text for Item description: plain text, Markdown, or Lexical/ProseMirror? | Affects frontend editor component and storage format |
| 6 | Notification system: in-app only (WebSocket), or are email notifications required? | Can be added in a later Phase, but good to know for schema design |
| 7 | Multi-tenancy: workspace isolation at the DB level (row-level security) or application level only? | Important for compliance/enterprise requirements |

---

## 12. Immediate Priorities

> **Recommendation:** Start with Phase 1 — Infrastructure, in this order:

1. **Add missing fields to `Item.java`** — required before writing migrations.
2. **Write the full `application.yaml`** (datasource, JPA, Flyway, JWT).
3. **Write `SecurityConfig.java`** — so the API can run with auth.
4. **Write all Flyway migrations** V1 -> V13 — to prepare the DB schema.
5. **Implement the User domain** (Repository + Service + Controller + DTOs).
6. **Implement the Workspace domain** — depends on User.
7. Continue in dependency order...

---

*This file is a living document — continuously updated as new decisions are made or phases are completed.*
