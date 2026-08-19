import { axiosClient } from './axiosClient';
import type { Project, PageResponse } from '../types';

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
}

export const projectApi = {
  getProjectsByWorkspace: async (
    workspaceHandle: string,
    name?: string,
    page = 0,
    size = 50
  ): Promise<PageResponse<Project>> => {
    const params: Record<string, any> = { page, size };
    if (name) params.name = name;
    const response = await axiosClient.get<PageResponse<Project>>(
      `/workspaces/${workspaceHandle}/projects`,
      { params }
    );
    return response.data;
  },

  getProject: async (handle: string): Promise<Project> => {
    const response = await axiosClient.get<Project>(`/projects/${handle}`);
    return response.data;
  },

  createProject: async (
    workspaceHandle: string,
    payload: CreateProjectPayload
  ): Promise<Project> => {
    const response = await axiosClient.post<Project>(
      `/workspaces/${workspaceHandle}/projects`,
      payload
    );
    return response.data;
  },

  updateProject: async (handle: string, payload: UpdateProjectPayload): Promise<Project> => {
    const response = await axiosClient.patch<Project>(`/projects/${handle}`, payload);
    return response.data;
  },

  deleteProject: async (handle: string): Promise<void> => {
    await axiosClient.delete(`/projects/${handle}`);
  },
};
