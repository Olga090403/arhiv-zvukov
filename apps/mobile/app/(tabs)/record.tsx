import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";

export default function RecordScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recording]);

  function formatTime(s: number) {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  function handleToggle() {
    if (recording) {
      setRecording(false);
      router.push("/confirm");
    } else {
      setSeconds(0);
      setRecording(true);
    }
  }

  // Mock level bars
  const bars = Array.from({ length: 24 }, (_, i) => {
    const base = recording ? 15 + Math.sin(i * 0.8 + seconds * 2) * 35 + Math.random() * 20 : 8;
    return Math.max(8, Math.min(100, base));
  });

  return (
    <View style={styles.container}>
      {/* Timer */}
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <Text style={styles.hint}>
        {recording ? "Идёт запись…" : "Нажми, чтобы начать запись"}
      </Text>

      {/* Level bars */}
      <View style={styles.barsContainer}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: `${h}%`,
                backgroundColor: recording ? colors.brand.amber : colors.text.muted + "30",
              },
            ]}
          />
        ))}
      </View>

      {/* Record button */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.recordBtn, recording && styles.recordBtnActive]}
          onPress={handleToggle}
        >
          {recording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Ionicons name="mic" size={40} color={colors.bg.paper} />
          )}
        </Pressable>

        <Text style={styles.controlHint}>
          {recording ? "Остановить и перейти к подтверждению" : "Записать звук"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.black,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  timer: {
    fontFamily: fonts.mono,
    fontSize: 64,
    color: colors.bg.paper,
    letterSpacing: 4,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    gap: 3,
    marginVertical: spacing.xxl,
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
  controls: {
    alignItems: "center",
    gap: spacing.md,
  },
  recordBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.destructive,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.bg.paper + "30",
  },
  recordBtnActive: {
    backgroundColor: colors.destructive,
  },
  stopIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.bg.paper,
  },
  controlHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text.muted,
    textAlign: "center",
  },
});
