import {
  getCertificationIdByCode,
  getCertificationModules,
  getStudyTaskCount,
  insertStudyTasks,
} from "@/features/study/repositories/study.repository";
import type {
  GeneratedStudyTask,
  StudyProfile,
} from "@/features/study/types/study.types";
import {
  adjustDurationForExperience,
  formatDateForDatabase,
} from "@/features/study/utils/study.utils";

const CERTIFICATION_CODE_MAP: Record<string, string> = {
  "ITIL 4 Foundation": "ITIL4_FOUNDATION",
};

export async function createInitialStudyPlan(
  userId: string,
  profile: StudyProfile,
): Promise<GeneratedStudyTask[]> {
  const existingTaskCount = await getStudyTaskCount(userId);

  if (existingTaskCount > 0) {
    throw new Error("STUDY_PLAN_ALREADY_EXISTS");
  }

  const certificationName = profile.certification;
  if (!certificationName) throw new Error("No certification is selected.");

  const certificationCode = CERTIFICATION_CODE_MAP[certificationName];
  if (!certificationCode) {
    throw new Error(`Unsupported certification: ${certificationName}`);
  }

  const certificationId = await getCertificationIdByCode(certificationCode);
  const modules = await getCertificationModules(certificationId);

  if (modules.length === 0) {
    throw new Error("No modules were found for this certification.");
  }

  const availableLessons = modules.flatMap((module) => {
    const publishedLessons = [...(module.certification_lessons ?? [])]
      .filter((lesson) => lesson.is_published)
      .sort((first, second) => first.sort_order - second.sort_order);

    return publishedLessons.map((lesson) => ({ lesson, module }));
  });

  if (availableLessons.length === 0) {
    throw new Error(
      "No published lessons are available for this certification.",
    );
  }

  const requestedStudyDays = profile.study_days_per_week ?? 3;
  const studyDays = Math.min(
    Math.max(requestedStudyDays, 1),
    availableLessons.length,
  );

  const generatedTasks: GeneratedStudyTask[] = availableLessons
    .slice(0, studyDays)
    .map(({ lesson, module }, index) => {
      const scheduledDate = new Date();
      scheduledDate.setHours(12, 0, 0, 0);
      scheduledDate.setDate(scheduledDate.getDate() + index);

      const baseDuration =
        lesson.estimated_minutes ?? module.estimated_minutes ?? 15;

      return {
        user_id: userId,
        lesson_id: lesson.id,
        title: lesson.title,
        description:
          module.description ?? `Study lesson from ${module.title}.`,
        task_type: "lesson",
        scheduled_date: formatDateForDatabase(scheduledDate),
        estimated_minutes: adjustDurationForExperience(
          baseDuration,
          profile.experience_level,
        ),
        completed: false,
      };
    });

  await insertStudyTasks(generatedTasks);
  return generatedTasks;
}
