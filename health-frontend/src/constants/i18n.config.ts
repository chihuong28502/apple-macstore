export const locales = [
  "en",
  "vi",
  "de",
  "fr",
  "es",
  "it",
  "tr",
  "pt",
  "hi",
  "ja",
  "ru",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
