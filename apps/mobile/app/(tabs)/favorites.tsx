import { useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Linking, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { GradientBackground } from "../../src/components/GradientBackground";
import { useFavorites } from "../../src/lib/useFavorites";
import { formatDuration, WEB_BASE_URL } from "../../src/lib/format";

export default function FavoritesScreen() {
  const { favorites, loading, refresh, remove } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function openSound(id: string) {
    Linking.openURL(`${WEB_BASE_URL}/sound/${id}`).catch(() => {
      Alert.alert("Ошибка", "Не удалось открыть браузер");
    });
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Избранное</Text>
            {!loading && (
              <Text style={styles.count}>{favorites.length}</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openSound(item.id)}>
            <View style={styles.cardMain}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {formatDuration(item.duration)} · {item.author}
              </Text>
            </View>
            <Pressable
              style={styles.removeBtn}
              onPress={() => remove(item.id)}
              hitSlop={8}
            >
              <Ionicons name="heart-dislike-outline" size={22} color={colors.destructive} />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={colors.brand.amber} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>Здесь пока ничего нет</Text>
              <Text style={styles.emptyHint}>Добавляй звуки из каталога</Text>
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
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: colors.text.primary,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text.muted,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardMain: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardMeta: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.text.muted,
  },
  removeBtn: {
    padding: spacing.xs,
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.brand.amber,
    marginTop: spacing.sm,
  },
});
