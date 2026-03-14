import { COLORS } from '@/constants/colors'

interface MediaItem {
  alt?: string | null
  image?: { url: string; width?: number; height?: number }
}

export function getAvailableColors(media: MediaItem[]): string[] {
  const found = new Set<string>()
  for (const item of media) {
    const alt = item.alt ?? ''
    const match = alt.match(/\bin\s+([^,]+)/i)
    if (!match) continue
    const color = match[1].toLowerCase().trim()
    if (COLORS.includes(color as any)) found.add(color)
  }
  return Array.from(found)
}
