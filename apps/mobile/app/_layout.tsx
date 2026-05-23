import { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts, Unbounded_400Regular, Unbounded_700Bold } from "@expo-google-fonts/unbounded";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { colors } from "../src/theme";
import { useAuth } from "../src/lib/useAuth";
import { registerForPushNotificationsAsync } from "../src/lib/pushNotifications";
import { GradientBackground } from "../src/components/GradientBackground";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Unbounded_400Regular,
    Unbounded_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
  });

  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pushRegistered = useRef(false);

  useEffect(() => {
    if (!fontsLoaded || loading) return;

    const onLoginScreen = segments[0] === "login";

    if (!session && !onLoginScreen) {
      router.replace("/login");
    } else if (session && onLoginScreen) {
      router.replace("/");
    }
  }, [session, loading, fontsLoaded, segments]);

  useEffect(() => {
    if (session?.user && !pushRegistered.current) {
      pushRegistered.current = true;
      registerForPushNotificationsAsync(session.user.id);
    }
    if (!session) {
      pushRegistered.current = false;
    }
  }, [session]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loader}>
        <GradientBackground />
        <ActivityIndicator size="large" color={colors.brand.amber} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
