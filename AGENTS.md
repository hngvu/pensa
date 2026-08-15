# AGENTS.md — Guide for AI Agents

This document provides the architectural map, coding conventions, and specific guidelines for AI agents (Copilot, Antigravity, Cursor, etc.) working on the **Pensa** repository.

---

## Project Overview

Pensa is a full-stack, monorepo **project management** application consisting of 2 modules:

| Module | Directory | Technologies |
|--------|---------|-----------|
| Backend API | `api/` | Java 21, Spring Boot 4.1 |
| Frontend Web | `web/` | React 19, TypeScript 6, Vite 8 |

---

## Detailed Directory Structure

```
pensa/
├── api/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/soqe/pensa/api/
│       │   │   ├── PensaApiApplication.java   # Entry point
│       │   │   ├── common/                    # Base entities, audit config
│       │   │   ├── workspaces/                # Workspace, WorkspaceMember, WorkspaceRole
│       │   │   ├── projects/                  # Project, ProjectMember, ProjectRole
│       │   │   ├── sections/                  # Section
│       │   │   ├── items/                     # Item (task/issue, sub-task)
│       │   │   ├── comments/                  # Comment
│       │   │   ├── attachments/               # Attachment
│       │   │   ├── labels/                    # Label
│       │   │   ├── activities/                # Activity log
│       │   │   └── users/                     # User
│       │   └── resources/
│       │       ├── application.yaml
│       │       └── db/migration/              # Flyway SQL migrations (V{n}__{desc}.sql)
│       └── test/
│           └── java/soqe/pensa/api/           # Mirror of main/ structure
└── web/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx                           # Entry point
        ├── App.tsx
        ├── App.css
        └── index.css
```

---

## Backend Architecture (`api/`)

### Entity Inheritance Hierarchy

```
BaseEntity                      (id: UUID time-based, version: Long)
  └── AuditableEntity           (createdAt, createdBy, updatedAt, updatedBy)
        └── SoftDeletableEntity (deletedAt → soft delete via @SQLDelete)
              ├── Workspace
              ├── Project
              ├── Section
              ├── Item
              ├── Comment
              ├── Attachment
              ├── Label
              ├── Activity
              └── User
```

**Important Rules:**
- **Never** `DELETE` records directly — always use soft delete (`repository.delete(entity)`).
- `@SQLRestriction("deleted_at IS NULL")` is automatically applied to all queries.
- Optimistic locking via `@Version` is enabled on all entities.

### Domain Model & Relationships

```
Workspace (1) ──< WorkspaceMember >── (N) User
Workspace (1) ──< Project
Project   (1) ──< ProjectMember >── (N) User
Project   (1) ──< Section
Section   (1) ──< Item
Item      (1) ──< Item (self-ref: parentItemId, sub-tasks)
Item      (1) ──< Comment
Item      (1) ──< Attachment
Item      (1) ──< Label
Item      (1) ──< Activity
```

### Dependency Stack

| Library | Purpose |
|----------|----------|
| `spring-boot-starter-webmvc` | REST API |
| `spring-boot-starter-websocket` | Real-time updates |
| `spring-boot-starter-security` + OAuth2 Resource Server | Authentication/Authorization via JWT |
| `spring-boot-starter-data-jpa` + Hibernate | ORM |
| `spring-boot-starter-flyway` + `flyway-database-postgresql` | Schema migration |
| `spring-boot-starter-validation` | Bean Validation |
| `springdoc-openapi-starter-webmvc-api` | OpenAPI docs |
| `lombok` | Reduce boilerplate (`@Getter`, `@Setter`, `@Builder`, etc.) |
| `postgresql` (runtime) | JDBC driver |

---

## Coding Conventions — Backend

### Domain-driven Package Organization (feature-based)

Each domain (workspace, project, section, item...) resides in its own package:
```
soqe.pensa.api.<domain>/
  <Entity>.java
  <Entity>Repository.java   (JpaRepository)
  <Entity>Service.java
  <Entity>Controller.java   (@RestController)
  <Entity>Request.java      (input DTO)
  <Entity>Response.java     (output DTO)
```

### Entities

- Inherit from `SoftDeletableEntity` for entities requiring soft delete (default for all).
- Use `UUID` for all foreign keys (stored as columns, avoid `@ManyToOne` lazy joins unless absolutely necessary).
- Explicitly use `@Column(nullable = false)`, do not rely on defaults.

### REST API Conventions

- Base path: `/api/v1`
- Use plural nouns: `/workspaces`, `/projects`, `/items`
- Nested resources: `/workspaces/{workspaceId}/projects`, `/projects/{projectId}/sections/{sectionId}/items`
- Response: always return DTOs, never return JPA entities directly.
- Errors: use `@ControllerAdvice` + `ProblemDetail` (RFC 9457).

### Security

- Every endpoint requires authentication (JWT Bearer token).
- Role-based authorization: check `WorkspaceRole` / `ProjectRole` within the service layer.
- Do not hardcode secrets or credentials in the code.

### Flyway Migrations

- Place files in `src/main/resources/db/migration/`.
- Naming convention: `V{n}__{description}.sql` (e.g., `V1__create_workspaces_table.sql`).
- **Never modify** a committed migration — always create a new migration to apply fixes.

---

## Frontend Architecture (`web/`)

### Tech Stack

| Library | Version | Purpose |
|----------|---------|----------|
| React | 19 | UI framework |
| TypeScript | ~6.0 | Type safety |
| Vite | ^8.2 | Build tool / dev server |
| oxlint | ^1.75 | Linting |

### Coding Conventions — Frontend

- **Components**: PascalCase, one file per component.
- **Hooks**: `use` prefix, e.g., `useWorkspace`, `useItems`.
- **Types/Interfaces**: `Props` suffix for component props, e.g., `ItemCardProps`.
- **API calls**: isolated in `src/api/` or `src/services/`, do not fetch directly within components.
- Use TypeScript strict mode.

---

## Development Environment

### Running the Backend
```bash
cd api
./mvnw spring-boot:run
# or on Windows:
mvnw.cmd spring-boot:run
```
> Server: `http://localhost:8080`  
> OpenAPI UI: `http://localhost:8080/swagger-ui.html`

### Running the Frontend
```bash
cd web
npm install
npm run dev
```
> Frontend: `http://localhost:5173`

### Running Tests
```bash
# Backend
cd api && ./mvnw test

# Frontend lint
cd web && npm run lint
```

---

## Guidelines for Creating New Features

### Adding a New Domain (Backend)

1. Create the package `soqe.pensa.api.<domain>/`
2. Create the entity inheriting from `SoftDeletableEntity`, add `@SQLDelete` and `@SQLRestriction`
3. Create `<Entity>Repository extends JpaRepository<Entity, UUID>`
4. Create `<Entity>Service` containing business logic
5. Create `<Entity>Controller` with `@RestController` and `@RequestMapping`
6. Create the Flyway SQL migration for the new table
7. Write unit tests in `src/test/`

### Adding a Database Migration

```sql
-- src/main/resources/db/migration/V{n}__create_{table}_table.sql
CREATE TABLE {table} (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    version     BIGINT      NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ
    -- add domain-specific columns here
);
```

---

## Anti-Patterns (What NOT to do)

- ❌ Never delete records using SQL DELETE — always use soft delete.
- ❌ Never return JPA entities directly from controllers — use DTOs.
- ❌ Never commit `application-local.yaml` or files containing credentials.
- ❌ Never modify a merged Flyway migration.
- ❌ Avoid using JPA `@ManyToOne` / `@OneToMany` joins unless there's a specific reason (prefer flat UUID foreign keys).
- ❌ Do not omit `@Column(nullable = false)` for mandatory fields.
