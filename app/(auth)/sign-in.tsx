import { router } from "expo-router";
import { useState } from "react";
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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        Alert.alert("Unable to sign in", error.message);
        return;
      }

      router.replace("/(tabs)");
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not sign you in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.brand}>PassPilot</Text>

        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Sign in to continue your certification journey.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email address</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            editable={!isSubmitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={styles.input}
            value={email}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            editable={!isSubmitting}
            onChangeText={setPassword}
            onSubmitEditing={handleSignIn}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.passwordInput}
            value={password}
          />

          <Pressable
            disabled={isSubmitting}
            onPress={() => router.push("/(auth)/forgot-password")}
            style={({ pressed }) => [
              styles.forgotPassword,
              pressed && styles.linkPressed,
            ]}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </Pressable>

          <Pressable
            disabled={isSubmitting}
            onPress={handleSignIn}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign in</Text>
            )}
          </Pressable>

          <Pressable
            disabled={isSubmitting}
            onPress={() => router.push("/(auth)/sign-up")}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.linkPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              Don&apos;t have an account?{" "}
              <Text style={styles.linkText}>Create one</Text>
            </Text>
          </Pressable>
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
  passwordInput: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    color: "#0F172A",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    paddingVertical: 12,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
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
    opacity: 0.65,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 20,
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 15,
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "800",
  },
  linkPressed: {
    opacity: 0.65,
  },
});
