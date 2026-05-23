import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../theme";
import { formatDuration } from "../lib/format";
import type { DbSound } from "../lib/database.types";

type Props = {
  sound: DbSound;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
};

export function SoundListItem({ sound, isFavorite, onToggleFavorite, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={2}>{sound.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{formatDuration(sound.duration)}</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText}>{sound.license}</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText} numberOfLines={1}>{sound.author}</Text>
        </View>
        <View style={styles.tags}>
          {(sound.tags ?? []).slice(0, 3).map((tag) => (
            <Text key={tag} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
      </View>
      <Pressable
        style={styles.favBtn}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        hitSlop={8}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? colors.destructive : colors.text.muted}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  main: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.text.muted,
    marginRight: spacing.xs,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.text.muted,
    marginRight: spacing.sm,
  },
  favBtn: {
    padding: spacing.xs,
  },
});
