import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { supabase } from "@/services/supabase/client";

const CERTIFICATIONS = [
  "ITIL 4 Foundation",
  "CompTIA A+",
  "CompTIA Network+",
  "CompTIA Security+",
  "AWS Cloud Practitioner",
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const STUDY_DAY_OPTIONS = [2, 3, 4, 5, 6, 7];

export default function OnboardingScreen() {
  const [certification, setCertification] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState<number | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Unable to load account",
          "Your session could not be found. Please sign in again.",
        );
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "certification, experience_level, exam_date, study_days_per_week, confidence_score",
        )
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Unable to load profile", error.message);
        return;
      }

      const onboardingIsComplete =
        Boolean(data.certification) &&
        Boolean(data.experience_level) &&
        Boolean(data.study_days_per_week) &&
        Boolean(data.confidence_score);

      if (onboardingIsComplete) {
        router.replace("/(tabs)");
        return;
      }

      if (data.certification) {
        setCertification(data.certification);
      }

      if (data.experience_level) {
        setExperienceLevel(data.experience_level);
      }

      if (data.exam_date) {
        setExamDate(data.exam_date);
      }

      if (data.study_days_per_week) {
        setStudyDaysPerWeek(data.study_days_per_week);
      }

      if (data.confidence_score) {
        setConfidenceScore(data.confidence_score);
      }
    } catch (error) {
      console.error("Load onboarding profile error:", error);

      Alert.alert(
        "Something went wrong",
        "We could not load your profile information.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleContinue() {
    if (!certification) {
      Alert.alert(
        "Choose a certification",
        "Select the certification you are studying for.",
      );
      return;
    }

    if (!experienceLevel) {
      Alert.alert(
        "Choose your experience level",
        "Select your current experience level.",
      );
      return;
    }

    if (!studyDaysPerWeek) {
      Alert.alert(
        "Choose study days",
        "Select how many days per week you plan to study.",
      );
      return;
    }

    if (!confidenceScore) {
      Alert.alert(
        "Choose a confidence level",
        "Select how confident you currently feel.",
      );
      return;
    }

    const normalizedExamDate = examDate.trim();

    if (normalizedExamDate && !/^\d{4}-\d{2}-\d{2}$/.test(normalizedExamDate)) {
      Alert.alert(
        "Invalid exam date",
        "Enter the date in YYYY-MM-DD format, such as 2026-09-18.",
      );
      return;
    }

    try {
      setIsSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Unable to save profile",
          "Your session could not be found. Please sign in again.",
        );
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          certification,
          experience_level: experienceLevel,
          exam_date: normalizedExamDate || null,
          study_days_per_week: studyDaysPerWeek,
          confidence_score: confidenceScore,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert("Unable to save profile", error.message);
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Save onboarding profile error:", error);

      Alert.alert(
        "Something went wrong",
        "We could not save your onboarding information.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.brand}>PassPilot</Text>

        <Text style={styles.title}>Build your study plan</Text>

        <Text style={styles.subtitle}>
          Tell us what you are preparing for so PassPilot can personalize your
          experience.
        </Text>

        <Text style={styles.sectionLabel}>Certification</Text>

        <View style={styles.optionGroup}>
          {CERTIFICATIONS.map((item) => {
            const selected = certification === item;

            return (
              <Pressable
                key={item}
                disabled={isSaving}
                onPress={() => setCertification(item)}
                style={({ pressed }) => [
                  styles.optionButton,
                  selected && styles.optionButtonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Experience level</Text>

        <View style={styles.optionGroup}>
          {EXPERIENCE_LEVELS.map((item) => {
            const selected = experienceLevel === item;

            return (
              <Pressable
                key={item}
                disabled={isSaving}
                onPress={() => setExperienceLevel(item)}
                style={({ pressed }) => [
                  styles.optionButton,
                  selected && styles.optionButtonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Target exam date</Text>

        <TextInput
          autoCapitalize="none"
          editable={!isSaving}
          keyboardType="numbers-and-punctuation"
          onChangeText={setExamDate}
          placeholder="YYYY-MM-DD (optional)"
          style={styles.input}
          value={examDate}
        />

        <Text style={styles.helperText}>
          You can leave this blank if you have not scheduled the exam yet.
        </Text>

        <Text style={styles.sectionLabel}>Study days per week</Text>

        <View style={styles.compactOptionGroup}>
          {STUDY_DAY_OPTIONS.map((item) => {
            const selected = studyDaysPerWeek === item;

            return (
              <Pressable
                key={item}
                disabled={isSaving}
                onPress={() => setStudyDaysPerWeek(item)}
                style={({ pressed }) => [
                  styles.numberButton,
                  selected && styles.optionButtonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.numberText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>
          How confident do you feel right now?
        </Text>

        <View style={styles.compactOptionGroup}>
          {[1, 2, 3, 4, 5].map((item) => {
            const selected = confidenceScore === item;

            return (
              <Pressable
                key={item}
                disabled={isSaving}
                onPress={() => setConfidenceScore(item)}
                style={({ pressed }) => [
                  styles.numberButton,
                  selected && styles.optionButtonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.numberText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.confidenceLabels}>
          <Text style={styles.confidenceLabel}>Not confident</Text>
          <Text style={styles.confidenceLabel}>Very confident</Text>
        </View>

        <Pressable
          disabled={isSaving}
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            isSaving && styles.buttonDisabled,
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Create my study plan</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 14,
    color: "#64748B",
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  brand: {
    marginBottom: 16,
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "800",
  },
  title: {
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  sectionLabel: {
    marginTop: 22,
    marginBottom: 10,
    color: "#334155",
    fontSize: 15,
    fontWeight: "800",
  },
  optionGroup: {
    gap: 10,
  },
  compactOptionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    minHeight: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  optionButtonSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#DBEAFE",
  },
  optionText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: "#1D4ED8",
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    color: "#0F172A",
    fontSize: 16,
  },
  helperText: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },
  numberButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  numberText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "800",
  },
  confidenceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  confidenceLabel: {
    color: "#64748B",
    fontSize: 12,
  },
  primaryButton: {
    minHeight: 56,
    marginTop: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#2563EB",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});
