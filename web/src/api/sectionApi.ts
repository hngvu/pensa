import { axiosClient } from './axiosClient';
import type { Section } from '../types';

export interface CreateSectionPayload {
  name: string;
  position?: string;
}

export const sectionApi = {
  getSections: async (projectHandle: string): Promise<Section[]> => {
    const response = await axiosClient.get<Section[]>(`/projects/${projectHandle}/sections`);
    return response.data;
  },

  createSection: async (projectHandle: string, payload: CreateSectionPayload): Promise<Section> => {
    const response = await axiosClient.post<Section>(`/projects/${projectHandle}/sections`, payload);
    return response.data;
  },

  updateSection: async (sectionHandle: string, payload: { name: string }): Promise<Section> => {
    const response = await axiosClient.patch<Section>(`/sections/${sectionHandle}`, payload);
    return response.data;
  }
};

