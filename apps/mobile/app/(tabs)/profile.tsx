import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { useAuth } from "../../src/lib/AuthProvider";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  function handleAuth() {
    if (user) {
      Alert.alert("Выйти?", "Загрузки останутся привязаны к аккаунту", [
        { text: "Отмена", style: "cancel" },
        { text: "Выйти", style: "destructive", onPress: signOut },
      ]);
    } else {
      router.push("/auth");
    }
  }

  return (
    <View style={styles.container}>
      {/* Avatar area */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons
            name={user ? "person" : "person-outline"}
            size={40}
            color={user ? colors.bg.paper : colors.text.muted}
          />
        </View>
        <Text style={styles.name}>
          {user ? user.email : "Гость"}
        </Text>
        <Text style={styles.plan}>
          {user ? "Аккаунт подключён" : "Без аккаунта"}
        </Text>
      </View>

      {/* Menu items */}
      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={handleAuth}>
          <Ionicons
            name={user ? "log-out-outline" : "log-in-outline"}
            size={22}
            color={user ? colors.destructive : colors.brand.amber}
          />
          <Text style={[styles.menuText, user && { color: colors.destructive }]}>
            {user ? "Выйти" : "Войти / Регистрация"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </Pressable>

        <View style={styles.separator} />

        <Pressable style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={22} color={colors.text.secondary} />
          <Text style={styles.menuText}>О приложении</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </Pressable>
      </View>

      {/* Version */}
      <Text style={styles.version}>Архив звуков · v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.paper,
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
