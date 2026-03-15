/**
 * 27 个支持国家 — 名称 + 国旗 emoji
 */

export const COUNTRIES = [
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Czechia', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Hong Kong SAR', flag: '🇭🇰' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
] as const;

export type CountryName = (typeof COUNTRIES)[number]['name'];

export function getCountryFlag(name: string): string {
  const country = COUNTRIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  return country?.flag ?? '🏳️';
}
