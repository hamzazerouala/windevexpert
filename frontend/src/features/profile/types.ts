export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  job_title?: string;
  company?: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  website_url?: string;
  pcsoft_experience?: 'beginner' | 'intermediate' | 'expert';
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileForm {
  name: string;
  bio?: string;
  avatar_url?: string;
  job_title?: string;
  company?: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  website_url?: string;
  pcsoft_experience?: 'beginner' | 'intermediate' | 'expert';
  phone_number?: string;
}