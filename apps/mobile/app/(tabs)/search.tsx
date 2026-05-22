import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";

export default function VoiceSearchScreen() {
  const [listening, setListening] = useState(false);

  function handlePress() {
    if (listening) {
      setListening(false);
      Linking.openURL("https://arhiv-zvukov.vercel.app/search?q=скрип+снега");
    } else {
      setListening(true);
      setTimeout(() => setListening(false), 3000);
    }
  }

  return (
    <View style={styles.container}>
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
          onPress={handlePress}
        >
          <Ionicons
            name={listening ? "mic" : "mic-outline"}
            size={48}
            color={listening ? colors.bg.paper : colors.brand.amber}
          />
        </Pressable>

        <Text style={styles.title}>
          {listening ? "Слушаю…" : "Голосовой поиск"}
        </Text>
        <Text style={styles.subtitle}>
          {listening
            ? "Скажи, какой звук тебе нужен"
            : "Нажми на микрофон и опиши звук голосом"}
        </Text>
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
    backgroundColor: colors.bg.paper,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
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
    backgroundColor: colors.card,
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
