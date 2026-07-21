import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';

import { useSession } from './SessionProvider';

export default function AuthGate() {
  const { session, loading } = useSession();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }

    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) {
    return null;
  }

  return <Slot />;
}
