import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FavoriteSound {
  id: string;
  title: string;
  author: string;
  duration: number;
}

const KEY = "favorites";

async function loadFavorites(): Promise<FavoriteSound[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FavoriteSound[]) : [];
  } catch {
    return [];
  }
}

async function saveFavorites(items: FavoriteSound[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSound[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFavorites(await loadFavorites());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (sound: FavoriteSound) => {
    setFavorites((prev) => {
      if (prev.some((s) => s.id === sound.id)) return prev;
      const next = [sound, ...prev];
      void saveFavorites(next);
      return next;
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((s) => s.id !== id);
      void saveFavorites(next);
      return next;
    });
  }, []);

  const toggle = useCallback(
    async (sound: FavoriteSound) => {
      const exists = favorites.some((s) => s.id === sound.id);
      if (exists) {
        await remove(sound.id);
      } else {
        await add(sound);
      }
    },
    [favorites, add, remove],
  );

  const isFav = useCallback(
    (id: string) => favorites.some((s) => s.id === id),
    [favorites],
  );

  return { favorites, loading, refresh, add, remove, toggle, isFav };
}
