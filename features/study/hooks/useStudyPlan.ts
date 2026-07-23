import { useCallback, useMemo, useState } from "react";

import {
  getAuthenticatedStudyUser,
  getStudyPlanData,
} from "@/features/study/repositories/study.repository";
import { createInitialStudyPlan } from "@/features/study/services/study.service";
import type {
  StudyProfile,
  StudyTask,
} from "@/features/study/types/study.types";
import {
  calculateStudyPlanProgress,
  groupStudyTasks,
} from "@/features/study/utils/study.utils";

type StudyPlanError = {
  title: string;
  message: string;
} | null;

export function useStudyPlan() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<StudyPlanError>(null);

  const loadStudyPlan = useCallback(async (refreshing = false) => {
    try {
      setError(null);

      if (refreshing) setIsRefreshing(true);
      else setIsLoading(true);

      const user = await getAuthenticatedStudyUser();
      const studyPlan = await getStudyPlanData(user.id);

      setProfile(studyPlan.profile);
      setTasks(studyPlan.tasks);
    } catch (loadError) {
      console.error("Study plan loading error:", loadError);
      setError({
        title: "Unable to load study plan",
        message:
          loadError instanceof Error
            ? loadError.message
            : "We could not load your study plan.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const generateStudyPlan = useCallback(async () => {
    try {
      setError(null);
      setIsGenerating(true);

      const user = await getAuthenticatedStudyUser();
      let currentProfile = profile;

      if (!currentProfile) {
        const studyPlan = await getStudyPlanData(user.id);
        currentProfile = studyPlan.profile;
        setProfile(studyPlan.profile);
      }

      await createInitialStudyPlan(user.id, currentProfile);
      await loadStudyPlan();

      return { success: true as const, alreadyExists: false };
    } catch (generationError) {
      console.error("Study plan generation error:", generationError);

      if (
        generationError instanceof Error &&
        generationError.message === "STUDY_PLAN_ALREADY_EXISTS"
      ) {
        await loadStudyPlan();
        return { success: false as const, alreadyExists: true };
      }

      setError({
        title: "Unable to create study plan",
        message:
          generationError instanceof Error
            ? generationError.message
            : "We could not generate your study plan.",
      });

      return { success: false as const, alreadyExists: false };
    } finally {
      setIsGenerating(false);
    }
  }, [loadStudyPlan, profile]);

  const groupedTasks = useMemo(() => groupStudyTasks(tasks), [tasks]);
  const progress = useMemo(() => calculateStudyPlanProgress(tasks), [tasks]);
  const nextIncompleteTask = useMemo(
    () => tasks.find((task) => !task.completed) ?? null,
    [tasks],
  );

  return {
    tasks,
    profile,
    groupedTasks,
    progress,
    nextIncompleteTask,
    isLoading,
    isRefreshing,
    isGenerating,
    error,
    loadStudyPlan,
    generateStudyPlan,
  };
}
