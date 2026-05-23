import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Linking, Alert, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { GradientBackground } from "../../src/components/GradientBackground";

const WEB_SEARCH_URL = "https://arhiv-zvukov.vercel.app/search";

export default function VoiceSearchScreen() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  function handleVoicePress() {
    if (listening) {
      setListening(false);
      if (query.trim()) {
        openWebSearch(query.trim());
      }
    } else {
      setListening(true);
      setTimeout(() => {
        setListening(false);
        Alert.alert(
          "Голосовой поиск",
          "Распознавание речи требует dev-build. Введи запрос текстом и нажми «Искать».",
        );
      }, 2500);
    }
  }

  function openWebSearch(q: string) {
    const url = `${WEB_SEARCH_URL}?q=${encodeURIComponent(q)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Ошибка", "Не удалось открыть браузер");
    });
  }

  function handleTextSearch() {
    Keyboard.dismiss();
    if (!query.trim()) {
      Alert.alert("Пусто", "Введи описание звука");
      return;
    }
    openWebSearch(query.trim());
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.content}>
        {/* Pulse rings */}
        {listening && (
          <>
            <View style={[styles.ring, styles.ring1]} />
            <View style={[styles.ring, styles.ring2]} />
          </>
        )}

        {/* Mic button */}
        <Pressable
          style={[styles.micBtn, listening && styles.micBtnActive]}
          onPress={handleVoicePress}
        >
          <Ionicons
            name={listening ? "mic" : "mic-outline"}
            size={48}
            color={listening ? colors.bg.paper : colors.brand.amber}
          />
        </Pressable>

        <Text style={styles.title}>
          {listening ? "Слушаю…" : "Поиск звуков"}
        </Text>
        <Text style={styles.subtitle}>
          {listening
            ? "Скажи, какой звук тебе нужен"
            : "Опиши звук голосом или введи текстом"}
        </Text>

        {/* Text search fallback */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="скрип снега, гудок метро…"
            placeholderTextColor={colors.text.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleTextSearch}
          />
          <Pressable style={styles.searchBtn} onPress={handleTextSearch}>
            <Ionicons name="search" size={20} color={colors.bg.paper} />
          </Pressable>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Ionicons name="information-circle-outline" size={18} color={colors.text.muted} />
        <Text style={styles.infoText}>
          Результаты откроются в веб-версии Архива звуков
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.brand.amber + "30",
  },
  ring1: {
    width: 200,
    height: 200,
  },
  ring2: {
    width: 280,
    height: 280,
  },
  micBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.border,
  },
  micBtnActive: {
    backgroundColor: colors.brand.amber,
    borderColor: colors.brand.amber,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    maxWidth: 260,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    width: "100%",
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand.black,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.text.muted,
    flex: 1,
  },
});
