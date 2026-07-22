import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { supabase } from "@/services/supabase/client";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{
    code?: string;
    access_token?: string;
    refresh_token?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    async function prepareRecoverySession() {
      try {
        if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            params.code,
          );

          if (error) {
            Alert.alert("Invalid reset link", error.message);
            return;
          }

          setHasRecoverySession(true);
          return;
        }

        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) {
            Alert.alert("Invalid reset link", error.message);
            return;
          }

          setHasRecoverySession(true);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setHasRecoverySession(true);
          return;
        }

        Alert.alert(
          "Invalid reset link",
          "This password reset link is missing the required recovery information.",
        );
      } catch {
        Alert.alert(
          "Something went wrong",
          "The password reset link could not be processed.",
        );
      } finally {
        setIsPreparing(false);
      }
    }

    prepareRecoverySession();
  }, [params.access_token, params.code, params.refresh_token]);

  async function handleUpdatePassword() {
    if (!password || !confirmPassword) {
      Alert.alert("Missing information", "Enter your new password twice.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your new password must be at least 8 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please enter them again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        Alert.alert("Unable to update password", error.message);
        return;
      }

      await supabase.auth.signOut();

      Alert.alert(
        "Password updated",
        "Your password has been changed. You can now sign in.",
        [
          {
            text: "Go to sign in",
            onPress: () => router.replace("/(auth)/sign-in"),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not update your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPreparing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>Preparing password reset...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.brand}>PassPilot</Text>

        <Text style={styles.title}>Reset your password</Text>

        <Text style={styles.subtitle}>
          Enter a new password for your account.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>New password</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            editable={!isSubmitting && hasRecoverySession}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Text style={styles.label}>Confirm new password</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            editable={!isSubmitting && hasRecoverySession}
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleUpdatePassword}
            placeholder="Enter the new password again"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
          />

          <Pressable
            disabled={isSubmitting || !hasRecoverySession}
            onPress={handleUpdatePassword}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              (isSubmitting || !hasRecoverySession) && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Update password</Text>
            )}
          </Pressable>

          {!hasRecoverySession && (
            <Pressable
              onPress={() => router.replace("/(auth)/forgot-password")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Request another reset email
              </Text>
            </Pressable>
          )}
        </View>
      </View>
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
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 14,
    color: "#475569",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brand: {
    marginBottom: 18,
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
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    marginTop: 32,
  },
  label: {
    marginBottom: 8,
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 54,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    color: "#0F172A",
    fontSize: 16,
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
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 20,
  },
  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
});
