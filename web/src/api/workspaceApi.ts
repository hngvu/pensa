import { axiosClient } from './axiosClient';
import type { Workspace, PageResponse } from '../types';

export interface CreateWorkspacePayload {
  name: string;
  visibility?: 'PRIVATE' | 'PUBLIC';
  avatarUrl?: string;
  settings?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  visibility?: 'PRIVATE' | 'PUBLIC';
  avatarUrl?: string;
  settings?: string;
}

export const workspaceApi = {
  getWorkspaces: async (name?: string, page = 0, size = 50): Promise<PageResponse<Workspace>> => {
    const params: Record<string, any> = { page, size };
    if (name) params.name = name;
    const response = await axiosClient.get<PageResponse<Workspace>>('/workspaces', { params });
    return response.data;
  },

  getWorkspace: async (handle: string): Promise<Workspace> => {
    const response = await axiosClient.get<Workspace>(`/workspaces/${handle}`);
    return response.data;
  },

  createWorkspace: async (payload: CreateWorkspacePayload): Promise<Workspace> => {
    const response = await axiosClient.post<Workspace>('/workspaces', payload);
    return response.data;
  },

  updateWorkspace: async (handle: string, payload: UpdateWorkspacePayload): Promise<Workspace> => {
    const response = await axiosClient.patch<Workspace>(`/workspaces/${handle}`, payload);
    return response.data;
  },

  deleteWorkspace: async (handle: string): Promise<void> => {
    await axiosClient.delete(`/workspaces/${handle}`);
  },
};
