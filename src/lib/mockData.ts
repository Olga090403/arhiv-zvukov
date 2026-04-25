export interface Sound {
  id: string;
  title: string;
  description: string;
  author: string;
  license: "CC0" | "CC BY" | "CC BY-SA";
  duration: number; // seconds
  tags: string[];
  category: string;
  fileUrl: string;
  listenCount: number;
}

export const MOCK_SOUNDS: Sound[] = [
  {
    id: "1",
    title: "Скрип снега под валенком",
    description: "Записано зимой 2023, парк Горького, -15°C. Характерный сухой хруст промёрзшего снега.",
    author: "Ольга Шугурова",
    license: "CC0",
    duration: 8,
    tags: ["снег", "зима", "улица", "скрип"],
    category: "Природа",
    fileUrl: "",
    listenCount: 312,
  },
  {
    id: "2",
    title: "Гудок метро 80-х",
    description: "Оригинальная запись сигнала отправления поезда, ст. Площадь Революции, 1987.",
    author: "Архив Мосметро",
    license: "CC BY",
    duration: 5,
    tags: ["метро", "город", "транспорт", "советский"],
    category: "Город",
    fileUrl: "",
    listenCount: 841,
  },
  {
    id: "3",
    title: "Жужжание старой лампы",
    description: "Лампа накаливания 60 Вт, дребезжание цоколя. Идеально для ночных сцен.",
    author: "Field Notes Studio",
    license: "CC0",
    duration: 12,
    tags: ["лампа", "электричество", "жужжание", "интерьер"],
    category: "Техника",
    fileUrl: "",
    listenCount: 556,
  },
  {
    id: "4",
    title: "Капель с крыши",
    description: "Апрельская капель, деревянный подоконник. Медленный ритм, тёплое эхо.",
    author: "Vera Fieldwork",
    license: "CC0",
    duration: 20,
    tags: ["вода", "весна", "капель", "улица"],
    category: "Природа",
    fileUrl: "",
    listenCount: 229,
  },
  {
    id: "5",
    title: "Советская пишущая машинка",
    description: "Robotron 202, 1978 г. Резкий стук клавиш, характерный для советских машинок.",
    author: "RetroArchive",
    license: "CC BY",
    duration: 15,
    tags: ["машинка", "офис", "советский", "ретро"],
    category: "Ностальгия",
    fileUrl: "",
    listenCount: 704,
  },
  {
    id: "6",
    title: "Ночной трамвай",
    description: "Трамвай маршрута 17, Петербург, 3:00 ночи. Скрип рельсов на повороте.",
    author: "Night Field",
    license: "CC0",
    duration: 18,
    tags: ["трамвай", "ночь", "город", "рельсы"],
    category: "Город",
    fileUrl: "",
    listenCount: 468,
  },
  {
    id: "7",
    title: "Кофеварка-гейзер",
    description: "Алюминиевая моку-пот, утро. Бурление, свист пара — ритм пробуждения.",
    author: "Morning Rec",
    license: "CC0",
    duration: 22,
    tags: ["кофе", "кухня", "утро", "пар"],
    category: "Атмосфера",
    fileUrl: "",
    listenCount: 381,
  },
  {
    id: "8",
    title: "Старый телефон на рычаге",
    description: "Дисковый телефон ТА-68, звук укладки трубки на рычаг. Финал разговора.",
    author: "Soviet Sounds",
    license: "CC BY",
    duration: 3,
    tags: ["телефон", "советский", "ретро", "интерьер"],
    category: "Ностальгия",
    fileUrl: "",
    listenCount: 512,
  },
];

export const CATEGORIES = ["Все", "Природа", "Город", "Техника", "Ностальгия", "Атмосфера"];

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getSoundById(id: string): Sound | undefined {
  return MOCK_SOUNDS.find((s) => s.id === id);
}

export function searchSounds(query: string, category?: string): Sound[] {
  const q = query.toLowerCase();
  return MOCK_SOUNDS.filter((s) => {
    const matchQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.description.toLowerCase().includes(q);
    const matchCategory =
      !category || category === "Все" || s.category === category;
    return matchQuery && matchCategory;
  });
}
