import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type EmptyStudyPlanProps = {
  isGenerating: boolean;
  onGenerate: () => void;
};

export function EmptyStudyPlan({
  isGenerating,
  onGenerate,
}: EmptyStudyPlanProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>✦</Text>
      </View>
      <Text style={styles.title}>Let&apos;s build your first mission</Text>
      <Text style={styles.text}>
        PassPilot will use your certification, confidence, experience, and
        weekly availability to create a focused starter plan.
      </Text>

      <View style={styles.featureList}>
        <PlanFeature text="A personalized seven-day roadmap" />
        <PlanFeature text="Short, focused learning sessions" />
        <PlanFeature text="Real certification lessons" />
        <PlanFeature text="Progress tied to lesson completion" />
      </View>

      <Pressable
        disabled={isGenerating}
        onPress={onGenerate}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isGenerating && styles.buttonDisabled,
        ]}
      >
        {isGenerating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Generate my study plan</Text>
        )}
      </Pressable>
    </View>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureIconText}>✓</Text>
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 34,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
  },
  iconText: { color: "#2563EB", fontSize: 30, fontWeight: "900" },
  title: {
    marginTop: 20,
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  text: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  featureList: { width: "100%", marginTop: 24, gap: 12 },
  feature: { flexDirection: "row", alignItems: "center" },
  featureIcon: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
  },
  featureIconText: { color: "#15803D", fontSize: 13, fontWeight: "900" },
  featureText: {
    flex: 1,
    marginLeft: 10,
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    minHeight: 54,
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  buttonPressed: { opacity: 0.78 },
  buttonDisabled: { opacity: 0.6 },
});
