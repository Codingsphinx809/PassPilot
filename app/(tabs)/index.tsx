import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/services/supabase/client";

type Profile = {
  full_name: string | null;
  certification: string | null;
  experience_level: string | null;
  exam_date: string | null;
  study_days_per_week: number | null;
  confidence_score: number | null;
};

export default function HomeScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile(refreshing = false) {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
          "full_name, certification, experience_level, exam_date, study_days_per_week, confidence_score",
        )
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Unable to load dashboard", error.message);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Dashboard profile error:", error);

      Alert.alert(
        "Something went wrong",
        "We could not load your dashboard information.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Unable to sign out", error.message);
      }
    } catch (error) {
      console.error("Sign-out error:", error);

      Alert.alert(
        "Something went wrong",
        "We could not sign you out. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  function showComingSoon(feature: string) {
    Alert.alert(
      `${feature} is next`,
      `We will build the ${feature.toLowerCase()} section next.`,
    );
  }

  const displayName = useMemo(() => {
    const name = profile?.full_name?.trim();

    if (!name) {
      return "Welcome back";
    }

    const firstName = name.split(/\s+/)[0];

    return `Welcome back, ${firstName}`;
  }, [profile?.full_name]);

  const formattedExamDate = useMemo(() => {
    if (!profile?.exam_date) {
      return "Not scheduled";
    }

    const parsedDate = new Date(`${profile.exam_date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return profile.exam_date;
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [profile?.exam_date]);

  const daysUntilExam = useMemo(() => {
    if (!profile?.exam_date) {
      return null;
    }

    const examDate = new Date(`${profile.exam_date}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(examDate.getTime())) {
      return null;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const difference = examDate.getTime() - today.getTime();

    return Math.ceil(difference / millisecondsPerDay);
  }, [profile?.exam_date]);

  const examCountdownText = useMemo(() => {
    if (daysUntilExam === null) {
      return "Add an exam date when you are ready.";
    }

    if (daysUntilExam > 1) {
      return `${daysUntilExam} days remaining`;
    }

    if (daysUntilExam === 1) {
      return "1 day remaining";
    }

    if (daysUntilExam === 0) {
      return "Your exam is today";
    }

    return "Your selected exam date has passed";
  }, [daysUntilExam]);

  const confidencePercentage = useMemo(() => {
    const score = profile?.confidence_score ?? 0;

    return Math.min(Math.max(score / 5, 0), 1);
  }, [profile?.confidence_score]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />

        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>Building your dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadProfile(true)}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>PASSPILOT DASHBOARD</Text>
            <Text style={styles.welcomeText}>{displayName}</Text>

            <Text style={styles.headerSubtitle}>
              Stay focused and keep moving toward your certification.
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.trim()?.charAt(0).toUpperCase() ?? "P"}
            </Text>
          </View>
        </View>

        <View style={styles.certificationCard}>
          <Text style={styles.certificationLabel}>CURRENT CERTIFICATION</Text>

          <Text style={styles.certificationTitle}>
            {profile?.certification ?? "Certification not selected"}
          </Text>

          <View style={styles.certificationDetails}>
            <View style={styles.certificationDetail}>
              <Text style={styles.detailLabel}>Experience</Text>
              <Text style={styles.detailValue}>
                {profile?.experience_level ?? "Not selected"}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.certificationDetail}>
              <Text style={styles.detailLabel}>Weekly goal</Text>
              <Text style={styles.detailValue}>
                {profile?.study_days_per_week
                  ? `${profile.study_days_per_week} days`
                  : "Not selected"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your exam target</Text>

        <View style={styles.examCard}>
          <View style={styles.examDateIcon}>
            <Text style={styles.examDateIconText}>✓</Text>
          </View>

          <View style={styles.examTextContainer}>
            <Text style={styles.examDate}>{formattedExamDate}</Text>
            <Text style={styles.examCountdown}>{examCountdownText}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Current confidence</Text>

        <View style={styles.confidenceCard}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceTitle}>Confidence level</Text>

            <Text style={styles.confidenceScore}>
              {profile?.confidence_score ?? 0}/5
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${confidencePercentage * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.confidenceMessage}>
            {getConfidenceMessage(profile?.confidence_score)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Start studying</Text>

        <View style={styles.actionGrid}>
          <DashboardAction
            icon="▤"
            title="Study plan"
            description="Follow your personalized weekly schedule."
            onPress={() => showComingSoon("Study plan")}
          />

          <DashboardAction
            icon="◫"
            title="Flashcards"
            description="Review important terms and concepts."
            onPress={() => showComingSoon("Flashcards")}
          />

          <DashboardAction
            icon="✓"
            title="Practice exam"
            description="Test your knowledge before exam day."
            onPress={() => showComingSoon("Practice exam")}
          />

          <DashboardAction
            icon="↗"
            title="Progress"
            description="See your scores and study activity."
            onPress={() => showComingSoon("Progress tracking")}
          />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>TODAY&apos;S STUDY TIP</Text>

          <Text style={styles.tipTitle}>Consistency beats cramming</Text>

          <Text style={styles.tipText}>
            A focused 20-minute session today is more valuable than waiting for
            the perfect time to study.
          </Text>
        </View>

        <Pressable
          disabled={isSigningOut}
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.buttonPressed,
            isSigningOut && styles.buttonDisabled,
          ]}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#B91C1C" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign out</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type DashboardActionProps = {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
};

function DashboardAction({
  icon,
  title,
  description,
  onPress,
}: DashboardActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.actionCardPressed,
      ]}
    >
      <View style={styles.actionIcon}>
        <Text style={styles.actionIconText}>{icon}</Text>
      </View>

      <Text style={styles.actionTitle}>{title}</Text>

      <Text style={styles.actionDescription}>{description}</Text>
    </Pressable>
  );
}

function getConfidenceMessage(score: number | null | undefined) {
  switch (score) {
    case 1:
      return "You are at the beginning. Your study plan will help you build a strong foundation.";

    case 2:
      return "You have started building familiarity. Consistent review will make the material feel easier.";

    case 3:
      return "You have a solid starting point. Practice will help turn understanding into confidence.";

    case 4:
      return "You are feeling prepared. Focus on weak areas and practice questions.";

    case 5:
      return "Your confidence is high. Keep reviewing so you remain ready for exam day.";

    default:
      return "Complete your confidence assessment to personalize your recommendations.";
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },
  loadingText: {
    marginTop: 14,
    color: "#64748B",
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  eyebrow: {
    marginBottom: 7,
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  welcomeText: {
    color: "#0F172A",
    fontSize: 29,
    fontWeight: "800",
  },
  headerSubtitle: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
  },
  avatarText: {
    color: "#1D4ED8",
    fontSize: 19,
    fontWeight: "800",
  },
  certificationCard: {
    padding: 22,
    borderRadius: 20,
    backgroundColor: "#1D4ED8",
  },
  certificationLabel: {
    color: "#BFDBFE",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  certificationTitle: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  certificationDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
  },
  certificationDetail: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 38,
    marginHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  detailLabel: {
    color: "#BFDBFE",
    fontSize: 12,
  },
  detailValue: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
  },
  examCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  examDateIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
  },
  examDateIconText: {
    color: "#15803D",
    fontSize: 20,
    fontWeight: "900",
  },
  examTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  examDate: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },
  examCountdown: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 14,
  },
  confidenceCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confidenceTitle: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  confidenceScore: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    marginTop: 14,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  confidenceMessage: {
    marginTop: 13,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    minHeight: 178,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  actionCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
  },
  actionIconText: {
    color: "#2563EB",
    fontSize: 21,
    fontWeight: "900",
  },
  actionTitle: {
    marginTop: 16,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
  actionDescription: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },
  tipCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
  },
  tipLabel: {
    color: "#C2410C",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  tipTitle: {
    marginTop: 8,
    color: "#7C2D12",
    fontSize: 18,
    fontWeight: "800",
  },
  tipText: {
    marginTop: 8,
    color: "#9A3412",
    fontSize: 14,
    lineHeight: 21,
  },
  signOutButton: {
    minHeight: 52,
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
  },
  signOutButtonText: {
    color: "#B91C1C",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
