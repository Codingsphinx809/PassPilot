import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthGate from '@/providers/AuthGate';
import { SessionProvider } from '@/providers/SessionProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}
