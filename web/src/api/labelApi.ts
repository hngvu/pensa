import { axiosClient } from './axiosClient';
import type { Label } from '../types';

export interface CreateLabelPayload {
  name: string;
  backgroundColor: string;
  textColor: string;
}

export const labelApi = {
  getLabelsByProject: async (projectHandle: string): Promise<Label[]> => {
    const response = await axiosClient.get<Label[]>(`/projects/${projectHandle}/labels`);
    return response.data;
  },

  createLabel: async (projectHandle: string, payload: CreateLabelPayload): Promise<Label> => {
    const response = await axiosClient.post<Label>(`/projects/${projectHandle}/labels`, payload);
    return response.data;
  },

  updateLabel: async (labelId: string, payload: Partial<CreateLabelPayload>): Promise<Label> => {
    const response = await axiosClient.patch<Label>(`/labels/${labelId}`, payload);
    return response.data;
  },

  deleteLabel: async (labelId: string): Promise<void> => {
    await axiosClient.delete(`/labels/${labelId}`);
  }
};
