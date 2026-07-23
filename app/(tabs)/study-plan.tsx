import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DaySection } from "@/features/study/components/DaySection";
import { EmptyStudyPlan } from "@/features/study/components/EmptyStudyPlan";
import { MissionCard } from "@/features/study/components/MissionCard";
import { ProgressCard } from "@/features/study/components/ProgressCard";
import { StudyHeader } from "@/features/study/components/StudyHeader";
import { useStudyPlan } from "@/features/study/hooks/useStudyPlan";
import type { StudyTask } from "@/features/study/types/study.types";

export default function StudyPlanScreen() {
  const {
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
  } = useStudyPlan();

  const hasLoadedInitially = useRef(false);

  useEffect(() => {
    void loadStudyPlan().finally(() => {
      hasLoadedInitially.current = true;
    });
  }, [loadStudyPlan]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedInitially.current) return;
      void loadStudyPlan(true);
    }, [loadStudyPlan]),
  );

  useEffect(() => {
    if (error) Alert.alert(error.title, error.message);
  }, [error]);

  const openTask = useCallback((task: StudyTask) => {
    if (!task.lesson_id) {
      Alert.alert(
        "Lesson unavailable",
        "This scheduled task is not connected to a lesson.",
      );
      return;
    }

    router.push(`/lesson/${task.lesson_id}`);
  }, []);

  async function handleGenerateStudyPlan() {
    const result = await generateStudyPlan();

    if (result.success) {
      Alert.alert(
        "Your study plan is ready",
        "PassPilot created your first personalized learning plan.",
      );
      return;
    }

    if (result.alreadyExists) {
      Alert.alert(
        "Study plan already exists",
        "Your current lessons were preserved.",
      );
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Preparing your study plan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadStudyPlan(true)}
          />
        }
      >
        <StudyHeader certificationName={profile?.certification ?? null} />

        {tasks.length === 0 ? (
          <EmptyStudyPlan
            isGenerating={isGenerating}
            onGenerate={() => void handleGenerateStudyPlan()}
          />
        ) : (
          <>
            <ProgressCard
              completedTasks={progress.completedTasks}
              totalTasks={progress.totalTasks}
              percentage={progress.percentage}
            />

            <MissionCard
              nextLessonTitle={nextIncompleteTask?.title ?? null}
              onContinue={
                nextIncompleteTask
                  ? () => openTask(nextIncompleteTask)
                  : undefined
              }
            />

            {groupedTasks.map((group) => (
              <DaySection
                key={group.date}
                group={group}
                onOpenTask={openTask}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FB" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },
  loadingText: { marginTop: 14, color: "#64748B", fontSize: 15 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },
});
