# Pensa

Pensa is a full-stack project management platform inspired by tools like Linear and Jira. The system supports multi-user workspaces, role-based member permissions, section-based project/task management, labeling, commenting, file attachments, and real-time activity via WebSocket.

## Architecture Overview

```
pensa/
├── api/    # Backend – Spring Boot (Java 21)
└── web/    # Frontend – React 19 + Vite + TypeScript
```

| Layer    | Technology                                                                |
|----------|---------------------------------------------------------------------------|
| Backend  | Java 21, Spring Boot 4.1, Spring Security (OAuth2 Resource Server), Spring Data JPA, Flyway, WebSocket |
| Database | PostgreSQL                                                                |
| Frontend | React 19, TypeScript 6, Vite 8                                            |
| API Docs | SpringDoc OpenAPI 3                                                       |

---

## System Requirements

- **Java** 21+
- **Maven** 3.9+ (or use the included `mvnw` wrapper)
- **Node.js** 20+ and **npm** 10+
- **PostgreSQL** 15+
- **Identity Provider** compatible with OAuth2/OIDC (e.g., Keycloak, Auth0)

---

## Installation & Local Setup

### 1. Database

Create a PostgreSQL database:
```sql
CREATE DATABASE pensa;
```

Flyway will automatically run the migrations when the server starts.

### 2. Backend (`api/`)

Configure `api/src/main/resources/application.yaml` with your database credentials and OAuth2 issuer information:

```yaml
spring:
  application:
    name: api
  datasource:
    url: jdbc:postgresql://localhost:5432/pensa
    username: <db_user>
    password: <db_password>
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: <your-oauth2-issuer-uri>
```

Run the server:
```bash
cd api
./mvnw spring-boot:run
```

The server will start at `http://localhost:8080`.

### 3. Frontend (`web/`)

```bash
cd web
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## Key Features

- **Workspace & Project Management**: Create and manage multiple workspaces and projects.
- **User Permissions**: Flexible role-based access control (RBAC) system (Owner, Admin, Member, Guest).
- **Task/Issue Management**: Create, edit, and track task progress using sections (To Do, In Progress, Done). Supports parent/child tasks.
- **Real-time Interaction**: Receive instant notifications and data updates via WebSocket.
- **Attachments & Comments**: Upload files and discuss tasks through comments on each item.
- **Labeling**: Easily categorize tasks with a customizable labeling system.
- **Activity History**: Keep track of all changes with a detailed Activity log for each item.

---

## License

MIT
