import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../../src/theme";

export default function RecordScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [metering, setMetering] = useState<number[]>(new Array(24).fill(-160));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function formatTime(s: number) {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  async function startRecording() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Нет доступа", "Разреши доступ к микрофону в настройках");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        {
          isMeteringEnabled: true,
          android: {
            extension: ".m4a",
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {
            mimeType: "audio/webm",
            bitsPerSecond: 128000,
          },
        },
        (status) => {
          if (status.isRecording && status.metering != null) {
            setMetering((prev) => {
              const next = [...prev.slice(1), status.metering!];
              return next;
            });
          }
        },
        100
      );

      setRecording(rec);
      setIsRecording(true);
      setSeconds(0);

      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось начать запись");
    }
  }

  async function stopRecording() {
    if (!recording) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRecording(false);

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      setRecording(null);
      setMetering(new Array(24).fill(-160));

      if (uri) {
        router.push({ pathname: "/confirm", params: { audioUri: uri, duration: seconds.toString() } });
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось сохранить запись");
    }
  }

  function handleToggle() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const bars = metering.map((db) => {
    const normalized = Math.max(0, Math.min(1, (db + 60) / 60));
    return Math.max(8, normalized * 100);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <Text style={styles.hint}>
        {isRecording ? "Идёт запись…" : "Нажми, чтобы начать запись"}
      </Text>

      <View style={styles.barsContainer}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: `${h}%`,
                backgroundColor: isRecording ? colors.brand.amber : colors.text.muted + "30",
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
          onPress={handleToggle}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Ionicons name="mic" size={40} color={colors.bg.paper} />
          )}
        </Pressable>

        <Text style={styles.controlHint}>
          {isRecording ? "Остановить и перейти к подтверждению" : "Записать звук"}
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
