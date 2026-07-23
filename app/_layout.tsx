import {
  DarkTheme,
  DefaultTheme,
  router,
  Stack,
  ThemeProvider,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { SessionProvider, useSession } from "@/providers/SessionProvider";
import { supabase } from "@/services/supabase/client";

function RootNavigator() {
  const { session, loading: sessionLoading } = useSession();
  const segments = useSegments();

  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    void checkProfileAndRoute();
  }, [session, segments[0]]);

  async function checkProfileAndRoute() {
    if (sessionLoading) {
      return;
    }

    if (!session) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "certification, experience_level, study_days_per_week, confidence_score",
        )
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Profile routing error:", error.message);

        if (segments[0] !== "onboarding") {
          router.replace("/onboarding");
        }

        return;
      }

      const onboardingIsComplete =
        Boolean(data.certification) &&
        Boolean(data.experience_level) &&
        Boolean(data.study_days_per_week) &&
        Boolean(data.confidence_score);

      const isOnAuthScreen = segments[0] === "(auth)";
      const isOnOnboardingScreen = segments[0] === "onboarding";

      if (!onboardingIsComplete && !isOnOnboardingScreen) {
        router.replace("/onboarding");
        return;
      }

      if (
        onboardingIsComplete &&
        (isOnAuthScreen || isOnOnboardingScreen)
      ) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Profile routing error:", error);

      if (segments[0] !== "onboarding") {
        router.replace("/onboarding");
      }
    } finally {
      setProfileLoading(false);
    }
  }

  if (sessionLoading || (session && profileLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]" />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
  },
});