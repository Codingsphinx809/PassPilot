import { StyleSheet, Text, View } from "react-native";
import { TaskCard } from "@/features/study/components/TaskCard";
import type {
  StudyTask,
  StudyTaskGroup,
} from "@/features/study/types/study.types";
import { formatStudyDate } from "@/features/study/utils/study.utils";

type DaySectionProps = {
  group: StudyTaskGroup;
  onOpenTask: (task: StudyTask) => void;
};

export function DaySection({ group, onOpenTask }: DaySectionProps) {
  const completedCount = group.tasks.filter((task) => task.completed).length;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatStudyDate(group.date)}</Text>
        <Text style={styles.count}>
          {completedCount}/{group.tasks.length}
        </Text>
      </View>

      <View style={styles.taskList}>
        {group.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={() => onOpenTask(task)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 26 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: "#0F172A", fontSize: 18, fontWeight: "800" },
  count: { color: "#64748B", fontSize: 13, fontWeight: "700" },
  taskList: { gap: 12 },
});
