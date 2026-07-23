import { supabase } from "@/services/supabase/client";

import type {
  CertificationModule,
  GeneratedStudyTask,
  StudyPlanData,
  StudyProfile,
  StudyTask,
} from "@/features/study/types/study.types";

type AuthenticatedUser = {
  id: string;
};

export async function getAuthenticatedStudyUser(): Promise<AuthenticatedUser> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Your account session could not be found.");
  }

  return { id: user.id };
}

export async function getStudyProfile(userId: string): Promise<StudyProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "certification, experience_level, exam_date, study_days_per_week, confidence_score",
    )
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getStudyTasks(userId: string): Promise<StudyTask[]> {
  const { data, error } = await supabase
    .from("study_tasks")
    .select(
      "id, lesson_id, title, description, task_type, scheduled_date, estimated_minutes, completed, completed_at",
    )
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getStudyPlanData(userId: string): Promise<StudyPlanData> {
  const [profile, tasks] = await Promise.all([
    getStudyProfile(userId),
    getStudyTasks(userId),
  ]);

  return { profile, tasks };
}

export async function getStudyTaskCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("study_tasks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getCertificationIdByCode(
  certificationCode: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("certifications")
    .select("id")
    .eq("code", certificationCode)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Certification not found.");
  }

  return data.id;
}

export async function getCertificationModules(
  certificationId: string,
): Promise<CertificationModule[]> {
  const { data, error } = await supabase
    .from("certification_modules")
    .select(
      `
      id,
      title,
      description,
      estimated_minutes,
      sort_order,
      certification_lessons (
        id,
        title,
        content,
        estimated_minutes,
        sort_order,
        is_published
      )
    `,
    )
    .eq("certification_id", certificationId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CertificationModule[];
}

export async function insertStudyTasks(
  tasks: GeneratedStudyTask[],
): Promise<void> {
  const { error } = await supabase.from("study_tasks").insert(tasks);

  if (error) {
    throw new Error(error.message);
  }
}
