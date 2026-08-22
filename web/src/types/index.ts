export interface Workspace {
  id: string;
  handle: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  handle: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  projectId: string;
  handle: string;
  name: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  projectHandle: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  projectId: string;
  projectHandle: string;
  projectSlug: string;
  sectionId: string;
  handle: string;
  slug: string;
  title: string;
  description?: string;
  position: string;
  isCompleted: boolean;
  sectionHandle: string;
  labels?: Label[];
  startAt?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'OBSERVER';
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  data: T[];
  meta: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
