import { Pressable, StyleSheet, Text, View } from "react-native";

type MissionCardProps = {
  nextLessonTitle: string | null;
  onContinue?: () => void;
};

export function MissionCard({ nextLessonTitle, onContinue }: MissionCardProps) {
  const canContinue = Boolean(nextLessonTitle && onContinue);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>TODAY&apos;S MISSION</Text>
      <Text style={styles.title}>
        {nextLessonTitle
          ? `Continue: ${nextLessonTitle}`
          : "Your current mission is complete"}
      </Text>
      <Text style={styles.text}>
        {nextLessonTitle
          ? "Open the lesson and continue from where you left off. PassPilot will save your progress automatically."
          : "You completed every lesson currently scheduled. Your next learning mission will appear here."}
      </Text>

      {canContinue ? (
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Continue lesson →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 18, padding: 20, borderRadius: 18, backgroundColor: "#FFF7ED" },
  label: { color: "#C2410C", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  title: { marginTop: 7, color: "#7C2D12", fontSize: 18, fontWeight: "800" },
  text: { marginTop: 7, color: "#9A3412", fontSize: 14, lineHeight: 21 },
  button: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: "#C2410C",
  },
  buttonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.78 },
});
