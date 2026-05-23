import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { GradientBackground } from "../../src/components/GradientBackground";
import { SoundListItem } from "../../src/components/SoundListItem";
import { supabase } from "../../src/lib/supabase";
import { useFavorites } from "../../src/lib/useFavorites";
import { CATEGORIES, mapCategory, WEB_BASE_URL } from "../../src/lib/format";
import type { DbSound } from "../../src/lib/database.types";

export default function CatalogScreen() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [sounds, setSounds] = useState<DbSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const { isFav, toggle, refresh: refreshFavorites } = useFavorites();

  const fetchSounds = useCallback(async (q: string, category: string) => {
    setLoading(true);
    setError(null);

    try {
      let request = supabase
        .from("sounds")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (q) {
        request = request.or(`title.ilike.%${q}%,tags.cs.{${q}}`);
      }

      const { data, error: dbError } = await request;

      if (dbError) {
        setError(dbError.message);
        return;
      }

      let filtered = (data ?? []) as DbSound[];
      if (category !== "Все") {
        filtered = filtered.filter(
          (s) =>
            s.tags.some((t) => t.toLowerCase() === category.toLowerCase()) ||
            mapCategory(s.tags) === category,
        );
      }
      setSounds(filtered);
    } catch {
      setError("Нет подключения к серверу");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
      fetchSounds(activeQuery, activeCategory);
    }, [activeQuery, activeCategory, fetchSounds, refreshFavorites]),
  );

  function handleSearch() {
    Keyboard.dismiss();
    setActiveQuery(query.trim());
  }

  function handleVoicePress() {
    if (listening) {
      setListening(false);
      if (query.trim()) {
        setActiveQuery(query.trim());
      }
      return;
    }

    setListening(true);
    setTimeout(() => {
      setListening(false);
      Alert.alert(
        "Голосовой поиск",
        "Распознавание речи требует dev-build. Введи запрос текстом.",
      );
    }, 2500);
  }

  function openSound(id: string) {
    Linking.openURL(`${WEB_BASE_URL}/sound/${id}`).catch(() => {
      Alert.alert("Ошибка", "Не удалось открыть браузер");
    });
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="скрип снега, гудок метро…"
            placeholderTextColor={colors.text.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <Pressable style={styles.iconBtn} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={colors.bg.paper} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, listening && styles.iconBtnActive]}
            onPress={handleVoicePress}
          >
            <Ionicons
              name={listening ? "mic" : "mic-outline"}
              size={20}
              color={listening ? colors.bg.paper : colors.brand.amber}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.resultRow}>
          <Text style={styles.sectionTitle}>
            {activeQuery ? `«${activeQuery}»` : "Все звуки"}
          </Text>
          {!loading && (
            <Text style={styles.count}>{sounds.length}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <FlatList
        data={sounds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <SoundListItem
            sound={item}
            isFavorite={isFav(item.id)}
            onToggleFavorite={() =>
              toggle({
                id: item.id,
                title: item.title,
                author: item.author,
                duration: item.duration,
              })
            }
            onPress={() => openSound(item.id)}
          />
        )}
        refreshing={loading}
        onRefresh={() => fetchSounds(activeQuery, activeCategory)}
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
              <Ionicons name="search-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>Здесь пока ничего нет</Text>
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
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
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
    marginRight: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand.black,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  iconBtnActive: {
    backgroundColor: colors.brand.amber,
  },
  categories: {
    paddingBottom: spacing.md,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  chipActive: {
    backgroundColor: colors.brand.black,
    borderColor: colors.brand.black,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.bg.paper,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: colors.text.primary,
    flex: 1,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text.muted,
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
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.destructive,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
