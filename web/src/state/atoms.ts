import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Active workspace handle selected by the user
export const activeWorkspaceHandleAtom = atom<string | null>(null);

// Sidebar collapsed state
export const sidebarCollapsedAtom = atom<boolean>(false);

// Modal states for creating resources
export const createWorkspaceModalOpenAtom = atom<boolean>(false);
export const createProjectModalOpenAtom = atom<boolean>(false);
export const createSectionModalOpenAtom = atom<boolean>(false);

// Tracks whether the user has been synced to the backend
// Use sessionStorage so it survives F5 but resets when browser closes
export const authSyncedAtom = atomWithStorage<boolean>('pensa_auth_synced', false, {
  getItem: (key) => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : false;
  },
  setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
  removeItem: (key) => sessionStorage.removeItem(key),
});
