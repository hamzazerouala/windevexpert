export interface VideoProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  progress_percentage: number;
  last_position_seconds: number;
  last_watched_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  course_id: string;
  parent_id?: string;
  content: string;
  user: {
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PlayerState {
  currentChapter: string | null;
  playbackRate: number;
  isMuted: boolean;
  volume: number;
  lastPosition: number;
}