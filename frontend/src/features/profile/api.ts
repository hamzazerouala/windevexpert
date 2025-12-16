import { api } from '@/lib/api';
import { Profile, ProfileForm } from './types';

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get<Profile>('/user/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileForm): Promise<Profile> => {
    const response = await api.put<Profile>('/user/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post<{ avatar_url: string }>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};