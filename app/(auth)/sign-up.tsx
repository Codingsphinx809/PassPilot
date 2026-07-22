import { router } from "expo-router";
import { useState } from "react";
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

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete every field.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 8 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Make sure both password fields are identical.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: normalizedName,
          },
        },
      });

      if (error) {
        Alert.alert("Unable to create account", error.message);
        return;
      }

      if (!data.session) {
        router.replace({
          pathname: "/(auth)/check-email",
          params: {
            email: normalizedEmail,
          },
        });

        return;
      }

      router.replace("/(tabs)");
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not create your account. Please try again.",
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.brand}>PassPilot</Text>

          <Text style={styles.title}>Create your account</Text>

          <Text style={styles.subtitle}>
            Start building your personalized certification study plan.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>

            <TextInput
              autoComplete="name"
              editable={!isSubmitting}
              onChangeText={setFullName}
              placeholder="Your full name"
              returnKeyType="next"
              style={styles.input}
              value={fullName}
            />

            <Text style={styles.label}>Email address</Text>

            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              editable={!isSubmitting}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              returnKeyType="next"
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              returnKeyType="next"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <Text style={styles.label}>Confirm password</Text>

            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              onChangeText={setConfirmPassword}
              onSubmitEditing={handleSignUp}
              placeholder="Enter your password again"
              returnKeyType="done"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
            />

            <Pressable
              disabled={isSubmitting}
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </Pressable>

            <Pressable
              disabled={isSubmitting}
              onPress={() => router.replace("/(auth)/sign-in")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Already have an account?{" "}
                <Text style={styles.linkText}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
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
});
