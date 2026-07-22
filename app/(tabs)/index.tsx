import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/services/supabase/client";

export default function HomeScreen() {
  const [status, setStatus] = useState("Testing Supabase connection...");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus(`Connection error: ${error.message}`);
        return;
      }

      if (!data.session) {
        setStatus("Supabase connected, but no active session was found.");
        return;
      }

      setStatus("Supabase connection successful!");
    }

    testConnection();
  }, []);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Unable to sign out", error.message);
        return;
      }

      router.replace("/(auth)/sign-in");
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not sign you out. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  const isTesting = status.startsWith("Testing");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome to PassPilot! Love</Text>

        {isTesting && <ActivityIndicator size="large" />}

        <Text style={styles.status}>{status}</Text>

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
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    padding: 24,
  },
  card: {
    gap: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D8DEE9",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  status: {
    color: "#374151",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  signOutButton: {
    minHeight: 52,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#DC2626",
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});
