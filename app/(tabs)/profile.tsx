import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

export default function ProfileScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Unable to sign out", error.message);
      }
    } catch {
      Alert.alert("Something went wrong", "We could not sign you out.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile settings</Text>

        <Text style={styles.cardText}>
          Editing your certification, exam date, weekly schedule, confidence,
          and account information will be added here.
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FB",
  },
  eyebrow: {
    marginTop: 8,
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    marginTop: 7,
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "800",
  },
  card: {
    marginTop: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
  },
  cardText: {
    marginTop: 9,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
  },
  signOutButton: {
    minHeight: 52,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 13,
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
