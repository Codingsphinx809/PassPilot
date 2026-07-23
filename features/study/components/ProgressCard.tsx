import { StyleSheet, Text, View } from "react-native";
import { getProgressMessage } from "@/features/study/utils/study.utils";

type ProgressCardProps = {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
};

export function ProgressCard({
  completedTasks,
  totalTasks,
  percentage,
}: ProgressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.label}>PLAN PROGRESS</Text>
          <Text style={styles.title}>
            {completedTasks} of {totalTasks} lessons complete
          </Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.message}>{getProgressMessage(percentage)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, backgroundColor: "#172554" },
  header: { flexDirection: "row", justifyContent: "space-between" },
  headerCopy: { flex: 1, paddingRight: 16 },
  label: {
    color: "#93C5FD",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: { marginTop: 7, color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  percentage: { color: "#FFFFFF", fontSize: 27, fontWeight: "900" },
  track: {
    height: 10,
    marginTop: 18,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  fill: { height: "100%", borderRadius: 5, backgroundColor: "#60A5FA" },
  message: { marginTop: 12, color: "#BFDBFE", fontSize: 13, lineHeight: 19 },
});
