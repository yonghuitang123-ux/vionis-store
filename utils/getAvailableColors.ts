import { COLORS } from '@/constants/colors'

interface MediaItem {
  alt?: string | null
  image?: { url: string; width?: number; height?: number }
}

// 按长度降序排列，长的优先匹配
const SORTED_COLORS = [...COLORS].sort((a, b) => b.length - a.length)

export function getAvailableColors(media: MediaItem[]): string[] {
  const found = new Set<string>()
  for (const item of media) {
    const alt = (item.alt ?? '').toLowerCase()
    if (!alt) continue
    for (const color of SORTED_COLORS) {
      if (alt.includes(color)) {
        found.add(color)
        break // 一张图只匹配一个颜色（最长优先）
      }
    }
  }
  return Array.from(found)
}
