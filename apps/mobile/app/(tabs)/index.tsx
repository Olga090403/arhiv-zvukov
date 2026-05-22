import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { supabase } from "../../src/lib/supabase";
import type { DbUpload } from "../../src/lib/database.types";

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
      <FlatList
        data={uploads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchUploads}
        ListHeaderComponent={
          <>
            {/* Record CTA */}
            <Pressable
              style={styles.recordButton}
              onPress={() => router.push("/record")}
            >
              <View style={styles.recordIcon}>
                <Ionicons name="mic" size={36} color={colors.bg.paper} />
              </View>
              <Text style={styles.recordTitle}>Записать звук</Text>
              <Text style={styles.recordSubtitle}>
                Услышал интересный звук? Запиши за 30 секунд
              </Text>
            </Pressable>

            {/* Section header */}
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
              <ActivityIndicator size="large" color={colors.brand.amber} />
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
  container: {
    flex: 1,
    backgroundColor: colors.bg.paper,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  recordButton: {
    backgroundColor: colors.brand.black,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  recordIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brand.amber,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  recordTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.bg.paper,
  },
  recordSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
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
    padding: spacing.md,
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
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 10,
  },
  uploadMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.text.muted,
  },
  location: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text.muted,
  },
  empty: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
  },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.brand.amber,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.destructive,
    textAlign: "center",
  },
});
