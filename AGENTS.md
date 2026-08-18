# AGENTS.md — Guide for AI Agents

This document provides coding conventions and instructions for AI agents working on the **Pensa** repository.

## Project Structure
- Monorepo with two main modules:
  - **Backend**: `api/` (Java 21, Spring Boot 4.1, PostgreSQL)
  - **Frontend**: `web/` (React 19, TypeScript, Vite 8)

## Backend Coding Rules
- **Soft Deletes**: Never use SQL `DELETE`. Always use `repository.delete(entity)` with `@SQLDelete` and `@SQLRestriction("deleted_at IS NULL")`.
- **Foreign Keys**: Use flat `UUID` fields for foreign keys (e.g., `workspaceId`). Avoid `@ManyToOne` or `@OneToMany` lazy joins unless necessary.
- **Public vs Private IDs**: Use the 8-character `handle` string for REST API paths and responses. Internal DB relationships must use `UUID`.
- **DTOs**: Always return DTOs from Controllers, never JPA entities.
- **Records & Mapping**: DTOs must be Java `record`s annotated with `@Builder`. Perform Entity-to-DTO mapping **inline within Service methods** using the builder. Do not create external Mapper classes.
- **Auth Context**: Use `CurrentUserProvider.getCurrentUser()` to retrieve the logged-in user inside services instead of parsing `SecurityContextHolder` manually.
- **Service Boundaries**: A Service must **never** directly call the `Repository` of another domain (e.g., `ProjectService` must not inject `UserRepository`). Always communicate across domains via their respective Services (e.g., inject `UserService`).

## Database Migrations (Flyway)
- Place migrations in `api/src/main/resources/db/migration/`.
- Use the format: `V{n}__{description}.sql` (e.g., `V2__add_projects_table.sql`).
- **Never modify** a committed migration. Create a new one to apply fixes.
- Mandatory columns: `id (UUID)`, `version`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`.

## Frontend Coding Rules
- **Naming**: PascalCase for Components (`Button.tsx`), `use` prefix for hooks (`useAuth.ts`), `Props` suffix for interfaces (`ButtonProps`).
- **Data Fetching**: Isolate API calls in `src/api/` or `src/services/`. Do not fetch directly within components.
- Use strict TypeScript.

## Dev Environment Commands
- **Run Backend**: `cd api && ./mvnw spring-boot:run`
- **Run Frontend**: `cd web && npm install && npm run dev`
- **Test Backend**: `cd api && ./mvnw test`
- **Lint Frontend**: `cd web && npm run lint`
