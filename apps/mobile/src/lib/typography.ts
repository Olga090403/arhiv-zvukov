/** Неразрывный пробел — предлоги и короткие слова не «висят» в конце строки */
export const NBSP = "\u00A0";

const HANGING_WORDS = [
  "из-за",
  "из-под",
  "перед",
  "между",
  "через",
  "сквозь",
  "вместо",
  "вследствие",
  "без",
  "вне",
  "для",
  "до",
  "за",
  "из",
  "изо",
  "к",
  "ко",
  "на",
  "над",
  "не",
  "ни",
  "но",
  "о",
  "об",
  "обо",
  "от",
  "ото",
  "под",
  "подо",
  "при",
  "про",
  "с",
  "со",
  "у",
  "в",
  "во",
  "и",
  "а",
  "или",
  "ли",
  "бы",
  "же",
  "то",
  "что",
  "как",
].sort((a, b) => b.length - a.length);

const hangingRe = new RegExp(
  `(^|[\\s(—–\\[«"])(${HANGING_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\s+(?=[«"('\\[]?[а-яА-ЯёЁ0-9])`,
  "giu",
);

export function typograf(text: string): string {
  if (!text || !/[а-яА-ЯёЁ]/.test(text)) return text;

  let result = text.replace(hangingRe, (_, before, word) => before + word + NBSP);

  result = result.replace(/(\d+)\s+(?=[а-яА-ЯёЁ])/g, `$1${NBSP}`);
  result = result.replace(/«\s+(?=[а-яА-ЯёЁ])/g, `«${NBSP}`);

  return result;
}

export const t = typograf;
