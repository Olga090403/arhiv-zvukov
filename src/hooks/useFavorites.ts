import { useState, useCallback } from "react";

export interface FavoriteSound {
  id: string;
  title: string;
  author: string;
  duration: number;
}

const KEY = "favorites";

function load(): FavoriteSound[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(items: FavoriteSound[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSound[]>(load);

  const add = useCallback((sound: FavoriteSound) => {
    setFavorites((prev) => {
      if (prev.some((s) => s.id === sound.id)) return prev;
      const next = [sound, ...prev];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((s) => s.id !== id);
      save(next);
      return next;
    });
  }, []);

  const isFav = useCallback(
    (id: string) => favorites.some((s) => s.id === id),
    [favorites]
  );

  return { favorites, add, remove, isFav };
}
