import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <Text style={styles.subtitle}>
        We will build this screen in the next step.
      </Text>

      <Pressable
        onPress={() => router.push('/(auth)/sign-up')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Create an account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 12,
    color: '#475569',
    fontSize: 16,
  },
  button: {
    marginTop: 28,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
