import { atom } from 'jotai';

// Active workspace handle selected by the user
export const activeWorkspaceHandleAtom = atom<string | null>(null);

// Sidebar collapsed state
export const sidebarCollapsedAtom = atom<boolean>(false);

// Modal states for creating resources
export const createWorkspaceModalOpenAtom = atom<boolean>(false);
export const createProjectModalOpenAtom = atom<boolean>(false);

// Tracks whether the user has been synced to the backend
export const authSyncedAtom = atom<boolean>(false);
