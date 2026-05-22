import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../src/theme";
import { supabase } from "../src/lib/supabase";

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Введи email и пароль");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль минимум 6 символов");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) Alert.alert("Ошибка", error.message);
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) {
          Alert.alert("Ошибка", error.message);
        } else {
          Alert.alert("Готово!", "Аккаунт создан. Проверь почту для подтверждения.");
        }
      }
    } catch {
      Alert.alert("Ошибка", "Нет подключения к серверу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-outline" size={32} color={colors.brand.amber} />
          </View>
          <Text style={styles.heading}>
            {mode === "login" ? "Вход" : "Регистрация"}
          </Text>
          <Text style={styles.subtitle}>
            {mode === "login"
              ? "Войди, чтобы сохранить загрузки в аккаунт"
              : "Создай аккаунт для синхронизации загрузок"}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="student@example.com"
            placeholderTextColor={colors.text.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Минимум 6 символов"
            placeholderTextColor={colors.text.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.bg.paper} />
            ) : (
              <Text style={styles.submitText}>
                {mode === "login" ? "Войти" : "Создать аккаунт"}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.paper,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    maxWidth: 280,
  },
  form: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  submitBtn: {
    backgroundColor: colors.brand.black,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.bg.paper,
  },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.brand.amber,
    textAlign: "center",
  },
});
