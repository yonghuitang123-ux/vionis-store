/**
 * i18n 配置 — 语言 / 货币 / 地区映射
 */

export const locales = [
  'en', 'fr', 'de', 'ja', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'da', 'fi', 'no', 'sv',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** 语言显示名 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  da: 'Dansk',
  fi: 'Suomi',
  no: 'Norsk',
  sv: 'Svenska',
};

/** 语言 → 默认货币 */
export const localeCurrencyMap: Record<Locale, string> = {
  en: 'USD',
  fr: 'EUR',
  de: 'EUR',
  ja: 'JPY',
  it: 'EUR',
  es: 'EUR',
  pt: 'EUR',
  nl: 'EUR',
  pl: 'PLN',
  cs: 'CZK',
  da: 'DKK',
  fi: 'EUR',
  no: 'NOK',
  sv: 'SEK',
};

/** 所有可选货币（用户可独立切换） */
export const currencies = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'ILS', symbol: '₪',  name: 'Israeli Shekel' },
] as const;

export type CurrencyCode = (typeof currencies)[number]['code'];

/** 判断路径中是否包含 locale 前缀 */
export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
