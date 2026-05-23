import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import { colors, fonts, spacing, radius } from "../src/theme";
import { supabase } from "../src/lib/supabase";
import { useAuth } from "../src/lib/useAuth";
import { GradientBackground } from "../src/components/GradientBackground";

export default function ConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ audioUri?: string; duration?: string }>();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [licenseAgreed, setLicenseAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const durationSec = parseInt(params.duration ?? "0", 10);
  const durationStr = `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, "0")}`;

  async function fetchLocation() {
    setGeoLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Нет доступа", "Разреши доступ к геолокации в настройках");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addr) {
        const parts = [addr.city, addr.region, addr.country].filter(Boolean);
        const coordStr = `${loc.coords.latitude.toFixed(2)}°N ${loc.coords.longitude.toFixed(2)}°E`;
        setLocation(parts.length > 0 ? `${parts.join(", ")}, ${coordStr}` : coordStr);
      } else {
        setLocation(`${loc.coords.latitude.toFixed(4)}°N ${loc.coords.longitude.toFixed(4)}°E`);
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось определить местоположение");
    } finally {
      setGeoLoading(false);
    }
  }

  async function uploadAudioFile(sessionId: string): Promise<string | null> {
    const audioUri = params.audioUri;
    if (!audioUri) return "pending://no-audio";

    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) return null;

      const fileName = `${sessionId}/${Date.now()}.m4a`;
      const base64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase.storage
        .from("mobile-uploads")
        .upload(fileName, decode(base64), {
          contentType: "audio/mp4",
          upsert: false,
        });

      if (error) {
        if (error.message?.includes("bucket") || error.message?.includes("not found")) {
          return `local://${audioUri}`;
        }
        throw error;
      }

      const { data: urlData } = supabase.storage.from("mobile-uploads").getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch {
      return `local://${audioUri}`;
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Введи название звука");
      return;
    }
    if (!licenseAgreed) {
      Alert.alert("Ошибка", "Подтверди лицензию");
      return;
    }
    if (!user) {
      Alert.alert("Ошибка", "Необходимо войти в аккаунт");
      return;
    }

    setSubmitting(true);
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const fileUrl = await uploadAudioFile(user.id);

      const { error } = await supabase.from("uploads").insert({
        session_id: user.id,
        user_id: user.id,
        title: title.trim(),
        file_url: fileUrl ?? "pending://upload-failed",
        tags: tagArray.length > 0 ? tagArray : null,
        location: location.trim() || null,
        license_agreed: true,
      });

      if (error) {
        Alert.alert("Ошибка", error.message);
        return;
      }

      Alert.alert("Отправлено!", "Звук отправлен на модерацию", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch {
      Alert.alert("Ошибка", "Нет подключения к серверу");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <GradientBackground />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Подтверждение</Text>
      <Text style={styles.subtitle}>Заполни информацию о записи</Text>

      {/* Audio preview */}
      <View style={styles.preview}>
        <Ionicons name="musical-notes-outline" size={28} color={colors.brand.amber} />
        <View>
          <Text style={styles.previewText}>Запись {durationStr}</Text>
          {params.audioUri && (
            <Text style={styles.previewFile} numberOfLines={1}>
              {params.audioUri.split("/").pop()}
            </Text>
          )}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.label}>Название *</Text>
      <TextInput
        style={styles.input}
        placeholder="Скрип снега, ул. Ленина"
        placeholderTextColor={colors.text.muted}
        value={title}
        onChangeText={setTitle}
      />

      {/* Tags */}
      <Text style={styles.label}>Теги</Text>
      <TextInput
        style={styles.input}
        placeholder="снег, зима, улица"
        placeholderTextColor={colors.text.muted}
        value={tags}
        onChangeText={setTags}
      />
      <Text style={styles.hint}>через запятую</Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Место записи</Text>
          <TextInput
            style={styles.input}
            placeholder="Нажми 📍 для определения"
            placeholderTextColor={colors.text.muted}
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <Pressable style={styles.geoBtn} onPress={fetchLocation} disabled={geoLoading}>
          {geoLoading ? (
            <ActivityIndicator size="small" color={colors.brand.amber} />
          ) : (
            <Ionicons name="location-outline" size={20} color={colors.brand.amber} />
          )}
        </Pressable>
      </View>

      {/* License checkbox */}
      <Pressable style={styles.checkRow} onPress={() => setLicenseAgreed(!licenseAgreed)}>
        <View style={[styles.checkbox, licenseAgreed && styles.checkboxChecked]}>
          {licenseAgreed && <Ionicons name="checkmark" size={14} color={colors.bg.paper} />}
        </View>
        <Text style={styles.checkLabel}>
          Подтверждаю, что звук записан мной и передаю его на условиях CC0 / CC BY *
        </Text>
      </Pressable>

      {/* Submit */}
      <Pressable
        style={[styles.submitBtn, (!title.trim() || !licenseAgreed || submitting) && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting || !title.trim() || !licenseAgreed}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={colors.bg.paper} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.bg.paper} />
            <Text style={styles.submitText}>Отправить на модерацию</Text>
          </>
        )}
      </Pressable>

      {/* Back */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Записать заново</Text>
      </Pressable>
    </ScrollView>
    </View>
  );
}

function decode(base64: string): Uint8Array {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

  const len = base64.length;
  let bufferLength = Math.floor(len * 0.75);
  if (base64[len - 1] === "=") bufferLength--;
  if (base64[len - 2] === "=") bufferLength--;

  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const e1 = lookup[base64.charCodeAt(i)];
    const e2 = lookup[base64.charCodeAt(i + 1)];
    const e3 = lookup[base64.charCodeAt(i + 2)];
    const e4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = (e1 << 2) | (e2 >> 4);
    bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    bytes[p++] = ((e3 & 3) << 6) | e4;
  }
  return bytes;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    color: colors.text.primary,
    marginTop: spacing.xl,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  previewText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.text.primary,
  },
  previewFile: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.text.muted,
    maxWidth: 200,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginTop: spacing.xs,
  },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  geoBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.brand.amber,
    borderColor: colors.brand.amber,
  },
  checkLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.brand.black,
    borderRadius: radius.full,
    paddingVertical: 16,
    marginTop: spacing.lg,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.bg.paper,
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  backText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
  },
});
