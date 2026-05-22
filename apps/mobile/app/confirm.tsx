import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../src/theme";
import { supabase } from "../src/lib/supabase";
import { useAuth } from "../src/lib/AuthProvider";
import { getSessionId } from "../src/lib/session";

export default function ConfirmScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [licenseAgreed, setLicenseAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Введи название звука");
      return;
    }
    if (!licenseAgreed) {
      Alert.alert("Ошибка", "Подтверди лицензию");
      return;
    }

    setSubmitting(true);
    try {
      const sessionId = await getSessionId();
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { error } = await supabase.from("uploads").insert({
        session_id: sessionId,
        user_id: user?.id ?? null,
        title: title.trim(),
        file_url: "pending://mobile-recording",
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Подтверждение</Text>
      <Text style={styles.subtitle}>Заполни информацию о записи</Text>

      {/* Preview placeholder */}
      <View style={styles.preview}>
        <Ionicons name="musical-notes-outline" size={28} color={colors.brand.amber} />
        <Text style={styles.previewText}>Запись 0:30</Text>
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
            placeholder="Определить автоматически"
            placeholderTextColor={colors.text.muted}
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <Pressable style={styles.geoBtn} onPress={() => setLocation("Москва, 55.75°N 37.62°E")}>
          <Ionicons name="location-outline" size={20} color={colors.brand.amber} />
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
        disabled={submitting}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.paper,
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
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  previewText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.text.primary,
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
    backgroundColor: colors.card,
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
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
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
