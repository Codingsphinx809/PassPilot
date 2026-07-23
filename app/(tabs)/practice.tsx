import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PracticeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.eyebrow}>KNOWLEDGE CHECK</Text>
        <Text style={styles.title}>Practice</Text>

        <Text style={styles.description}>
          Practice quizzes, mock exams, answer explanations, and your readiness
          score will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F7FB",
  },
  card: {
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  eyebrow: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
  },
  description: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
  },
});
