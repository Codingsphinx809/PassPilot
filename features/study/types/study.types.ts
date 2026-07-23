export type StudyTask = {
  id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  task_type: string;
  scheduled_date: string;
  estimated_minutes: number;
  completed: boolean;
  completed_at: string | null;
};

export type StudyProfile = {
  certification: string | null;
  experience_level: string | null;
  exam_date: string | null;
  study_days_per_week: number | null;
  confidence_score: number | null;
};

export type CertificationLesson = {
  id: string;
  title: string;
  content: string | null;
  estimated_minutes: number | null;
  sort_order: number;
  is_published: boolean;
};

export type CertificationModule = {
  id: string;
  title: string;
  description: string | null;
  estimated_minutes: number;
  sort_order: number;
  certification_lessons: CertificationLesson[];
};

export type GeneratedStudyTask = {
  user_id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  task_type: string;
  scheduled_date: string;
  estimated_minutes: number;
  completed: boolean;
};

export type StudyTaskGroup = {
  date: string;
  tasks: StudyTask[];
};

export type StudyPlanData = {
  profile: StudyProfile;
  tasks: StudyTask[];
};

export type StudyPlanProgress = {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
};
