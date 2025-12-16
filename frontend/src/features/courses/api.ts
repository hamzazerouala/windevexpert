import { api } from '@/lib/api';
import { Course, CourseWithChapters, Review } from './types';

export const coursesApi = {
  getCourses: async (params?: { version?: string; level?: string }): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses', { params });
    return response.data;
  },

  getCourse: async (id: string): Promise<CourseWithChapters> => {
    const response = await api.get<CourseWithChapters>(`/courses/${id}`);
    return response.data;
  },

  getCourseReviews: async (id: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/courses/${id}/reviews`);
    return response.data;
  },

  purchaseCourse: async (id: string): Promise<{ stripe_session_url: string }> => {
    const response = await api.post<{ stripe_session_url: string }>(`/courses/${id}/purchase`);
    return response.data;
  },

  getSecureVideoUrl: async (chapterId: string): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(`/courses/secure-url/${chapterId}`);
    return response.data;
  },
};