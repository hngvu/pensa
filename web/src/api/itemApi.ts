import { axiosClient } from './axiosClient';
import type { Item } from '../types';

export interface CreateItemPayload {
  title: string;
  sectionHandle: string;
  description?: string;
  position?: string;
  startAt?: string;
  dueAt?: string;
}

export const itemApi = {
  getItemsByProject: async (projectHandle: string): Promise<Item[]> => {
    const response = await axiosClient.get<Item[]>(`/projects/${projectHandle}/items`);
    return response.data;
  },

  createItem: async (payload: CreateItemPayload): Promise<Item> => {
    const response = await axiosClient.post<Item>('/items', payload);
    return response.data;
  },

  getItem: async (handle: string): Promise<Item> => {
    const response = await axiosClient.get<Item>(`/items/${handle}`);
    return response.data;
  },

  updateItem: async (handle: string, payload: Partial<Item> & { isCompleted?: boolean }): Promise<Item> => {
    const response = await axiosClient.patch<Item>(`/items/${handle}`, payload);
    return response.data;
  },

  assignLabel: async (itemHandle: string, labelId: string): Promise<void> => {
    await axiosClient.post(`/items/${itemHandle}/labels/${labelId}`);
  },

  removeLabel: async (itemHandle: string, labelId: string): Promise<void> => {
    await axiosClient.delete(`/items/${itemHandle}/labels/${labelId}`);
  }
};

