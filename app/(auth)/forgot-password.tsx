import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "@/services/supabase/client";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const redirectUrl = Linking.createURL("/reset-password");

      console.log("Password reset redirect URL:", redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: redirectUrl,
        },
      );

      if (error) {
        Alert.alert("Unable to send reset email", error.message);
        return;
      }

      Alert.alert(
        "Email Sent",
        "If an account exists for that email, a password reset link has been sent.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Something went wrong",
        "We could not send the password reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.subtitle}>
        Enter your email address and we&apos;ll send you a password reset link.
      </Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
        keyboardType="email-address"
        onChangeText={setEmail}
        onSubmitEditing={handleReset}
        placeholder="Email"
        returnKeyType="send"
        style={styles.input}
        value={email}
      />

      <Pressable
        disabled={loading}
        onPress={handleReset}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Email</Text>
        )}
      </Pressable>

      <Pressable
        disabled={loading}
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.back}>Back to Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    padding: 24,
  },
  title: {
    marginBottom: 12,
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    marginBottom: 24,
    color: "#64748B",
    fontSize: 16,
    lineHeight: 22,
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
  button: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#2563EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 24,
  },
  back: {
    color: "#2563EB",
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
