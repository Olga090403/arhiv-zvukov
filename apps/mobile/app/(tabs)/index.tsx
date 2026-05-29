import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, gradients } from "../../src/theme";
import { supabase } from "../../src/lib/supabase";
import type { DbUpload } from "../../src/lib/database.types";
import { GradientBackground } from "../../src/components/GradientBackground";

const STATUS_CONFIG = {
  pending: { label: "На модерации", color: colors.pending, icon: "time-outline" as const },
  approved: { label: "Опубликован", color: colors.success, icon: "checkmark-circle-outline" as const },
  rejected: { label: "Отклонён", color: colors.destructive, icon: "close-circle-outline" as const },
};

function UploadItem({ item }: { item: DbUpload }) {
  const st = STATUS_CONFIG[item.status];
  return (
    <View style={styles.uploadCard}>
      <View style={styles.uploadHeader}>
        <Text style={styles.uploadTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: st.color + "18" }]}>
          <Ionicons name={st.icon} size={12} color={st.color} />
          <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>
      <View style={styles.uploadMeta}>
        {(item.tags ?? []).slice(0, 3).map((tag) => (
          <Text key={tag} style={styles.tag}>#{tag}</Text>
        ))}
        {item.location && <Text style={styles.location}>· {item.location}</Text>}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [uploads, setUploads] = useState<DbUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("uploads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (dbError) {
        setError(dbError.message);
        return;
      }
      setUploads((data as DbUpload[]) ?? []);
    } catch {
      setError("Нет подключения к серверу");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  return (
    <View style={styles.container}>
      <GradientBackground />
      <FlatList
        data={uploads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchUploads}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>REELS · МОНТАЖ · PET-ПРОЕКТЫ</Text>
              <Text style={styles.heroTitle}>найди{"\n"}звук.</Text>
              <Text style={styles.heroSub}>
                Запиши редкий бытовой звук и добавь в архив за 30 секунд
              </Text>
            </View>

            <Pressable style={styles.recordButton} onPress={() => router.push("/record")}>
              <LinearGradient
                colors={[...gradients.sunsetButton.colors]}
                locations={[...gradients.sunsetButton.locations]}
                start={gradients.sunsetButton.start}
                end={gradients.sunsetButton.end}
                style={styles.recordGradient}
              >
                <View style={styles.recordIcon}>
                  <Ionicons name="mic" size={32} color={colors.brand.black} />
                </View>
                <Text style={styles.recordTitle}>Записать звук</Text>
                <Text style={styles.recordSubtitle}>Услышал вайб? Запиши прямо сейчас</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Мои загрузки</Text>
              {!loading && <Text style={styles.sectionCount}>{uploads.length}</Text>}
            </View>
          </>
        }
        renderItem={({ item }) => <UploadItem item={item} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={colors.brand.orange} />
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.destructive} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="cloud-upload-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>Здесь пока ничего нет</Text>
              <Text style={styles.emptyHint}>Запиши первый звук!</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, gap: spacing.md },
  hero: { marginBottom: spacing.xl, paddingVertical: spacing.md },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontWeight: "700",
  },
  heroTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1,
    color: colors.text.primary,
    textTransform: "lowercase",
    marginBottom: spacing.sm,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  recordButton: {
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing.md,
    shadowColor: colors.brand.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  recordGradient: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 200,
    justifyContent: "center",
  },
  recordIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  recordTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.brand.black,
  },
  recordSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.brand.black,
    opacity: 0.65,
    textAlign: "center",
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: colors.text.primary,
  },
  sectionCount: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text.muted,
  },
  uploadCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 88,
    gap: spacing.sm,
  },
  uploadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  uploadTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: { fontFamily: fonts.mono, fontSize: 10 },
  uploadMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  tag: { fontFamily: fonts.mono, fontSize: 11, color: colors.text.muted },
  location: { fontFamily: fonts.body, fontSize: 11, color: colors.text.muted },
  empty: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxl },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.text.muted },
  emptyHint: { fontFamily: fonts.body, fontSize: 13, color: colors.brand.orange, fontWeight: "600" },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.destructive, textAlign: "center" },
});
