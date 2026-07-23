import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StudyTask } from "@/features/study/types/study.types";
import { getTaskActionLabel } from "@/features/study/utils/study.utils";

type TaskCardProps = {
  task: StudyTask;
  onOpen: () => void;
};

export function TaskCard({ task, onOpen }: TaskCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${getTaskActionLabel(task)}: ${task.title}`}
      onPress={onOpen}
      style={({ pressed }) => [
        styles.card,
        task.completed && styles.completedCard,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.statusIcon,
          task.completed && styles.completedStatusIcon,
        ]}
      >
        <Text
          style={[
            styles.statusIconText,
            task.completed && styles.completedStatusIconText,
          ]}
        >
          {task.completed ? "✓" : "▶"}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.badge, task.completed && styles.completedBadge]}>
            <Text
              style={[
                styles.badgeText,
                task.completed && styles.completedBadgeText,
              ]}
            >
              {task.completed ? "Completed" : "Lesson"}
            </Text>
          </View>
        </View>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.duration}>{task.estimated_minutes} minutes</Text>
          <Text style={styles.action}>{getTaskActionLabel(task)} →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 17,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  completedCard: { borderColor: "#BBF7D0", backgroundColor: "#F8FFF9" },
  statusIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#EFF6FF",
  },
  completedStatusIcon: { backgroundColor: "#DCFCE7" },
  statusIconText: { color: "#2563EB", fontSize: 13, fontWeight: "900" },
  completedStatusIconText: { color: "#15803D" },
  content: { flex: 1, marginLeft: 13 },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  completedBadge: { backgroundColor: "#DCFCE7" },
  badgeText: { color: "#2563EB", fontSize: 10, fontWeight: "800" },
  completedBadgeText: { color: "#15803D" },
  description: { marginTop: 7, color: "#64748B", fontSize: 13, lineHeight: 19 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  duration: { color: "#475569", fontSize: 12, fontWeight: "700" },
  action: { color: "#2563EB", fontSize: 12, fontWeight: "800" },
  pressed: { opacity: 0.78 },
});
