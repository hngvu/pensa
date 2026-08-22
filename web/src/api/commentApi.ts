import { axiosClient } from './axiosClient';
import type { Comment } from '../types';

export const commentApi = {
  getCommentsByItem: async (itemHandle: string): Promise<Comment[]> => {
    const response = await axiosClient.get(`/items/${itemHandle}/comments`);
    return response.data;
  },

  createComment: async (itemHandle: string, content: string): Promise<Comment> => {
    const response = await axiosClient.post(`/items/${itemHandle}/comments`, { content });
    return response.data;
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    const response = await axiosClient.patch(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await axiosClient.delete(`/comments/${id}`);
  },
};
