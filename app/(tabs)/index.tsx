import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  const [status, setStatus] = useState("Testing Supabase connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus(`Connection error: ${error.message}`);
        return;
      }

      setStatus("Supabase connection successful!");
    }

    testConnection();
  }, []);

  const isTesting = status.startsWith("Testing");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.title}>ITIL Study App</Text>

        {isTesting && <ActivityIndicator size="large" />}

        <Text style={styles.status}>{status}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
    padding: 24,
  },
  card: {
    gap: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8dee9",
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  status: {
    color: "#374151",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
});
