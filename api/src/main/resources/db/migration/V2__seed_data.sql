-- V2__seed_data.sql
-- Seed initial data for local development

-- Generate a fixed UUID for the Admin user (external_id will simulate a Clerk ID)
INSERT INTO users (id, external_id, username, email, full_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'user_clerk123456789', 'admin', 'admin@pensa.soqe', 'Admin User');

-- Workspace
INSERT INTO workspaces (id, handle, name, slug, description, owner_id)
VALUES ('22222222-2222-2222-2222-222222222222', 'WKSP0001', 'Pensa HQ', 'pensa-hq', 'Main workspace for the Pensa team', '11111111-1111-1111-1111-111111111111');

-- Workspace Member
INSERT INTO workspace_members (id, workspace_id, user_id, role)
VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'OWNER');

-- Project
INSERT INTO projects (id, workspace_id, handle, name, slug, description)
VALUES ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'PRJ00001', 'Alpha Launch', 'alpha-launch', 'Roadmap for the MVP launch');

-- Project Member
INSERT INTO project_members (id, project_id, user_id, role)
VALUES ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'ADMIN');

-- Sections
INSERT INTO sections (id, project_id, handle, name, slug, position)
VALUES ('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444444', 'SEC00001', 'To Do', 'to-do', 'a'),
       ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444444', 'SEC00002', 'In Progress', 'in-progress', 'b'),
       ('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444444', 'SEC00003', 'Done', 'done', 'c');

-- Items (Tasks)
INSERT INTO items (id, project_id, section_id, handle, slug, title, description, position)
VALUES ('77777777-7777-7777-7777-777777777771', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666661', 'ITM00001', 'design-db', 'Design the Database Schema', 'Draw ERD and write Flyway scripts', 'a'),
       ('77777777-7777-7777-7777-777777777772', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666661', 'ITM00002', 'setup-docker', 'Setup Docker Compose', 'PostgreSQL and Clerk config', 'b'),
       ('77777777-7777-7777-7777-777777777773', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666662', 'ITM00003', 'build-frontend', 'Build React Frontend', 'Vite + Tailwind + Zustand', 'a');

-- Labels
INSERT INTO labels (id, project_id, name, background_color, text_color)
VALUES ('88888888-8888-8888-8888-888888888881', '44444444-4444-4444-4444-444444444444', 'Backend', '#4F46E5', '#FFFFFF'),
       ('88888888-8888-8888-8888-888888888882', '44444444-4444-4444-4444-444444444444', 'Frontend', '#E11D48', '#FFFFFF');

-- Item Labels
INSERT INTO item_labels (item_id, label_id)
VALUES ('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888881'),
       ('77777777-7777-7777-7777-777777777773', '88888888-8888-8888-8888-888888888882');
