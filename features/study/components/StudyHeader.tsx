import { StyleSheet, Text, View } from "react-native";

type StudyHeaderProps = {
  certificationName: string | null;
};

export function StudyHeader({ certificationName }: StudyHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>YOUR ROADMAP</Text>
      <Text style={styles.title}>Study Plan</Text>
      <Text style={styles.subtitle}>
        A focused path toward {certificationName ?? "your certification"}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 22 },
  eyebrow: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  title: {
    marginTop: 6,
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
  },
});
