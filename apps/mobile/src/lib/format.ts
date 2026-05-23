export const CATEGORIES = ["Все", "Природа", "Город", "Техника", "Ностальгия", "Атмосфера"];

export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function mapCategory(tags: string[]): string {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => ["снег", "дождь", "ветер", "вода", "капель", "природа"].includes(t))) return "Природа";
  if (lower.some((t) => ["метро", "трамвай", "город", "улица", "транспорт"].includes(t))) return "Город";
  if (lower.some((t) => ["лампа", "машинка", "электричество", "техника"].includes(t))) return "Техника";
  if (lower.some((t) => ["советский", "ретро", "ностальгия", "старый"].includes(t))) return "Ностальгия";
  if (lower.some((t) => ["кофе", "утро", "атмосфера", "ночь", "интерьер"].includes(t))) return "Атмосфера";
  return "Все";
}

export const WEB_BASE_URL =
  process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "http://localhost:5173";
