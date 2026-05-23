import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { useAuth } from "../../src/lib/useAuth";
import { supabase } from "../../src/lib/supabase";
import { GradientBackground } from "../../src/components/GradientBackground";

export default function ProfileScreen() {
  const { user } = useAuth();

  function handleLogout() {
    Alert.alert("Выйти?", "Загрузки останутся привязаны к аккаунту", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Выйти",
        style: "destructive",
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  }

  async function handleTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Архив звуков",
        body: "Твой звук прошёл модерацию и опубликован!",
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
    });
    Alert.alert("Готово", "Уведомление придёт через 3 секунды");
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.text.secondary} />
        </View>
        <Text style={styles.name}>{user?.email ?? "—"}</Text>
        <Text style={styles.plan}>Аккаунт подключён</Text>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.destructive} />
          <Text style={[styles.menuText, { color: colors.destructive }]}>Выйти</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </Pressable>

        <View style={styles.separator} />

        <Pressable style={styles.menuItem} onPress={handleTestNotification}>
          <Ionicons name="notifications-outline" size={22} color={colors.brand.amber} />
          <Text style={styles.menuText}>Тестовое уведомление</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </Pressable>

        <View style={styles.separator} />

        <Pressable style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={22} color={colors.text.secondary} />
          <Text style={styles.menuText}>О приложении</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </Pressable>
      </View>

      <Text style={styles.version}>Архив звуков · v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text.primary,
  },
  plan: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  menu: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  menuText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 22 + spacing.md,
  },
  version: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.text.muted,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
});
