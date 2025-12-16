export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail_url: string;
  intro_video_url?: string;
  price: number;
  original_price?: number;
  version: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'windev' | 'webdev' | 'windev-mobile' | 'bases-de-donnees' | 'mobile';
  prerequisites: string[];
  learning_objectives?: string[];
  objectives: string[];
  is_featured: boolean;
  rating?: number;
  rating_average?: number;
  rating_count?: number;
  enrolled_count?: number;
  students_count?: number;
  created_at: string;
  instructor?: {
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  video_url?: string;
  duration_seconds?: number;
  created_at: string;
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[];
}

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment?: string;
  helpful_count?: number;
  user: {
    name: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons?: Lesson[];
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  order_index: number;
  progress?: number;
  resources?: {
    name: string;
    type: string;
    url: string;
  }[];
  created_at: string;
}

export interface UserCourse extends Course {
  progress?: number;
  completed_at?: string;
  total_duration?: number;
}

export interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  timestamp?: number;
  likes_count?: number;
  user: {
    name: string;
    avatar_url?: string;
  };
  created_at: string;
}