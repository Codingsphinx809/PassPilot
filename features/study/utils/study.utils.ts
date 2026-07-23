import type {
  StudyPlanProgress,
  StudyTask,
  StudyTaskGroup,
} from "@/features/study/types/study.types";

export function groupStudyTasks(tasks: StudyTask[]): StudyTaskGroup[] {
  const groups = new Map<string, StudyTask[]>();

  for (const task of tasks) {
    const existingTasks = groups.get(task.scheduled_date) ?? [];
    existingTasks.push(task);
    groups.set(task.scheduled_date, existingTasks);
  }

  return Array.from(groups.entries()).map(([date, groupedTasks]) => ({
    date,
    tasks: groupedTasks,
  }));
}

export function calculateStudyPlanProgress(
  tasks: StudyTask[],
): StudyPlanProgress {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { completedTasks, totalTasks, percentage };
}

export function adjustDurationForExperience(
  minutes: number,
  experienceLevel: string | null,
): number {
  const normalizedLevel = experienceLevel?.toLowerCase() ?? "";

  if (
    normalizedLevel.includes("beginner") ||
    normalizedLevel.includes("new")
  ) {
    return Math.round(minutes * 1.2);
  }

  if (
    normalizedLevel.includes("advanced") ||
    normalizedLevel.includes("expert")
  ) {
    return Math.max(10, Math.round(minutes * 0.8));
  }

  return minutes;
}

export function formatDateForDatabase(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatStudyDate(dateValue: string): string {
  const date = new Date(`${dateValue}T12:00:00`);
  const today = new Date();
  const tomorrow = new Date();

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const comparisonDate = new Date(date);
  comparisonDate.setHours(0, 0, 0, 0);

  if (comparisonDate.getTime() === today.getTime()) return "Today";
  if (comparisonDate.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function getProgressMessage(percentage: number): string {
  if (percentage === 100) {
    return "Mission complete. You finished every lesson in this plan.";
  }
  if (percentage >= 75) return "You are almost there. Finish strong.";
  if (percentage >= 40) return "Good momentum. Keep building on it.";
  if (percentage > 0) return "Your progress has started. Keep going.";
  return "Complete your first lesson to begin building momentum.";
}

export function getTaskActionLabel(task: StudyTask): string {
  return task.completed ? "Review lesson" : "Start lesson";
}
