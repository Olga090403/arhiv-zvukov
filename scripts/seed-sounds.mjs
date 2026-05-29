/**
 * Seed starter sounds into Supabase via Management API.
 *
 * Usage:
 *   $env:SUPABASE_ACCESS_TOKEN="sbp_..."
 *   node scripts/seed-sounds.mjs
 */

const PROJECT_REF = "uggsrgwyymivzntnopze";

/** @type {Array<{title:string,description:string,file_url:string,duration:number,tags:string[],author:string,license:string,status:string}>} */
export const SEED_SOUNDS = [
  {
    title: "Скрип снега под валенком",
    description: "Хруст снега и лёд под ногами, зимняя улица",
    file_url: "https://actions.google.com/sounds/v1/transportation/car_through_icy_puddle.ogg",
    duration: 38,
    tags: ["снег", "зима", "скрип", "природа"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Гудок метро 80-х",
    description: "Станция метро, объявление и поезд в движении",
    file_url: "https://actions.google.com/sounds/v1/transportation/subway_nyc_in_motion.ogg",
    duration: 52,
    tags: ["метро", "город", "ностальгия", "транспорт"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Жужжание старой лампы",
    description: "Тихий гул лампы накаливания в тишине комнаты",
    file_url: "https://actions.google.com/sounds/v1/ambiences/ambient_hum_air_conditioner.ogg",
    duration: 60,
    tags: ["лампа", "техника", "ностальгия", "электричество"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Ночной трамвай",
    description: "Гул трамвая и городской фон поздним вечером",
    file_url: "https://actions.google.com/sounds/v1/transportation/engine_bus.ogg",
    duration: 45,
    tags: ["трамвай", "город", "ночь", "транспорт"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Пишущая машинка",
    description: "Ритмичный стук клавиш механической машинки",
    file_url: "https://actions.google.com/sounds/v1/foley/typewriter.ogg",
    duration: 28,
    tags: ["машинка", "ностальгия", "ретро", "техника"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Кофеварка утром",
    description: "Фон кофейни, утренний шум и посуда",
    file_url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
    duration: 90,
    tags: ["кофе", "утро", "атмосфера", "интерьер"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Капель с крыши",
    description: "Дождь по крыше, капли и мягкий фон",
    file_url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    duration: 75,
    tags: ["капель", "дождь", "вода", "природа"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Дисковый телефон",
    description: "Набор номера и гудки старого телефона",
    file_url: "https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg",
    duration: 35,
    tags: ["советский", "ретро", "ностальгия", "телефон"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Дождь по асфальту",
    description: "Сильный дождь, лужи и городской фон",
    file_url: "https://actions.google.com/sounds/v1/transportation/slow_wipers_in_rain.ogg",
    duration: 48,
    tags: ["дождь", "город", "природа", "атмосфера"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Шум города",
    description: "Городской трафик, машины и уличный гул",
    file_url: "https://actions.google.com/sounds/v1/transportation/city_traffic.ogg",
    duration: 65,
    tags: ["город", "улица", "транспорт", "атмосфера"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Станция метро",
    description: "Объявления и эхо подземной станции",
    file_url: "https://actions.google.com/sounds/v1/ambiences/subway_station_nyc.ogg",
    duration: 55,
    tags: ["метро", "город", "атмосфера"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Лесное утро",
    description: "Птицы и лёгкий ветер в летнем лесу",
    file_url: "https://actions.google.com/sounds/v1/ambiences/summer_forest.ogg",
    duration: 80,
    tags: ["природа", "утро", "лес", "птицы"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Старый двигатель",
    description: "Перебои и гул винтажного мотора",
    file_url: "https://actions.google.com/sounds/v1/transportation/hit_and_miss_engine.ogg",
    duration: 42,
    tags: ["техника", "машинка", "ностальгия", "мотор"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Гудок в тумане",
    description: "Далёкий гудок корабля или поезда в тишине",
    file_url: "https://actions.google.com/sounds/v1/transportation/air_horn_in_close_hall_series.ogg",
    duration: 25,
    tags: ["гудок", "атмосфера", "город", "ночь"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Ночной двор",
    description: "Тихий двор, редкие звуки и далёкий транспорт",
    file_url: "https://actions.google.com/sounds/v1/ambiences/outside_night.ogg",
    duration: 70,
    tags: ["ночь", "атмосфера", "город", "тишина"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Гравий под колёсами",
    description: "Хруст гравия, медленная езда по грунтовке",
    file_url: "https://actions.google.com/sounds/v1/transportation/driving_on_gravel.ogg",
    duration: 40,
    tags: ["дорога", "природа", "полевая запись"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Карнавальная атмосфера",
    description: "Шум толпы и ярмарочный фон",
    file_url: "https://actions.google.com/sounds/v1/ambiences/carnival_atmosphere.ogg",
    duration: 58,
    tags: ["атмосфера", "город", "толпа"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
  {
    title: "Ветер в поле",
    description: "Открытое пространство, ветер и редкие птицы",
    file_url: "https://actions.google.com/sounds/v1/ambiences/warm_afternoon_outdoors.ogg",
    duration: 85,
    tags: ["ветер", "природа", "поле", "атмосфера"],
    author: "Архив звуков",
    license: "CC0",
    status: "approved",
  },
];

function escapeSql(value) {
  return value.replace(/'/g, "''");
}

function toTagsArray(tags) {
  return `ARRAY[${tags.map((t) => `'${escapeSql(t)}'`).join(", ")}]::text[]`;
}

async function runQuery(token, query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)");
  process.exit(1);
}

const existing = await runQuery(
  token,
  "SELECT title FROM public.sounds WHERE status = 'approved';",
);
const existingTitles = new Set((existing ?? []).map((row) => row.title));

const toInsert = SEED_SOUNDS.filter((s) => !existingTitles.has(s.title));
if (toInsert.length === 0) {
  console.log("All seed sounds already exist.");
  process.exit(0);
}

const values = toInsert
  .map(
    (s) =>
      `('${escapeSql(s.title)}', '${escapeSql(s.description)}', '${escapeSql(s.file_url)}', ${s.duration}, ${toTagsArray(s.tags)}, '${escapeSql(s.author)}', '${s.license}', '${s.status}')`,
  )
  .join(",\n  ");

const insertSql = `
INSERT INTO public.sounds (title, description, file_url, duration, tags, author, license, status)
VALUES
  ${values};
`;

await runQuery(token, insertSql);

// Fix broken legacy rain URL if present
await runQuery(
  token,
  `UPDATE public.sounds
   SET file_url = 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
       tags = ARRAY['дождь','природа','атмосфера']::text[],
       title = 'Дождь в городе',
       description = 'Сильный дождь, атмосферная запись'
   WHERE file_url LIKE '%rainsound.com%';`,
);

console.log(`Inserted ${toInsert.length} sounds:`);
for (const s of toInsert) console.log(`  + ${s.title}`);

const count = await runQuery(
  token,
  "SELECT count(*)::int AS total FROM public.sounds WHERE status = 'approved';",
);
console.log(`Total approved sounds: ${count?.[0]?.total ?? "?"}`);
