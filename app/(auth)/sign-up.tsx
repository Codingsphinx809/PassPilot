import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { supabase } from '../../services/supabase/client';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    if (!normalizedName || !normalizedEmail || !password) {
      Alert.alert('Missing information', 'Please complete every field.');
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Password too short',
        'Your password must contain at least 8 characters.'
      );
      return;
    }

    try {
      setLoading(true);

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
        throw error;
      }

      if (!data.user) {
        throw new Error('Supabase did not return a user account.');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: normalizedName,
        });

      if (profileError) {
        throw profileError;
      }

      if (!data.session) {
        Alert.alert(
          'Check your email',
          'Your account was created. Open the confirmation email before signing in.'
        );

        router.replace('/(auth)/sign-in');
        return;
      }

      router.replace('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create your account.';

      Alert.alert('Sign-up failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PASSPILOT</Text>

        <Text style={styles.title}>Create your account</Text>

        <Text style={styles.subtitle}>
          Start building a personalized path toward your certification.
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              autoCapitalize="words"
              autoComplete="name"
              editable={!loading}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!loading}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              editable={!loading}
              style={styles.input}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create account"
            disabled={loading}
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creating account…' : 'Create account'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(auth)/sign-in')}
            disabled={loading}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>
              Already have an account? Sign in
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
    backgroundColor: '#F7F9FC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  eyebrow: {
    marginBottom: 12,
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 12,
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    marginTop: 32,
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    color: '#0F172A',
    fontSize: 16,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },
});
