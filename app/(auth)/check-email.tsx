import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { supabase } from "@/services/supabase/client";

export default function CheckEmailScreen() {
  const params = useLocalSearchParams<{ email?: string }>();

  const email =
    typeof params.email === "string" ? params.email.trim().toLowerCase() : "";

  const [isResending, setIsResending] = useState(false);

  async function handleResendEmail() {
    if (!email) {
      Alert.alert(
        "Email unavailable",
        "Return to the sign-up screen and enter your email again.",
      );
      return;
    }

    try {
      setIsResending(true);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        Alert.alert("Unable to resend email", error.message);
        return;
      }

      Alert.alert(
        "Email sent",
        `A new confirmation email was sent to ${email}.`,
      );
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not resend the confirmation email.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✉️</Text>
      </View>

      <Text style={styles.brand}>PassPilot</Text>

      <Text style={styles.title}>Check your email</Text>

      <Text style={styles.subtitle}>
        We created your account and sent a confirmation link to:
      </Text>

      {email ? <Text style={styles.email}>{email}</Text> : null}

      <Text style={styles.instructions}>
        Open the email and tap the confirmation link. After your email is
        verified, return to PassPilot and sign in.
      </Text>

      <Pressable
        onPress={() =>
          router.replace({
            pathname: "/(auth)/sign-in",
            params: email ? { email } : undefined,
          })
        }
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Go to sign in</Text>
      </Pressable>

      <Pressable
        disabled={isResending}
        onPress={handleResendEmail}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
          isResending && styles.buttonDisabled,
        ]}
      >
        {isResending ? (
          <ActivityIndicator color="#2563EB" />
        ) : (
          <Text style={styles.secondaryButtonText}>
            Resend confirmation email
          </Text>
        )}
      </Pressable>

      <Pressable
        disabled={isResending}
        onPress={() => router.replace("/(auth)/sign-up")}
        style={styles.changeEmailButton}
      >
        <Text style={styles.changeEmailText}>Use a different email</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconContainer: {
    width: 76,
    height: 76,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    backgroundColor: "#DBEAFE",
  },
  icon: {
    fontSize: 36,
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
    marginTop: 14,
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  email: {
    marginTop: 12,
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },
  instructions: {
    marginTop: 20,
    marginBottom: 32,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
  },
  primaryButton: {
    minHeight: 54,
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
  secondaryButton: {
    minHeight: 54,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "800",
  },
  changeEmailButton: {
    alignItems: "center",
    paddingVertical: 22,
  },
  changeEmailText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
