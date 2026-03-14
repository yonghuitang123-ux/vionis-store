import { COLORS } from '@/constants/colors'

interface MediaItem {
  alt?: string | null
  url?: string
  image?: { url: string; width?: number; height?: number }
}

// 按长度降序排列，长的优先匹配，避免 "grey" 误匹配 "heather grey"
const SORTED_COLORS = [...COLORS].sort((a, b) => b.length - a.length)

function extractColor(alt: string): string | null {
  if (!alt) return null
  const lower = alt.toLowerCase()
  for (const color of SORTED_COLORS) {
    if (lower.includes(color)) return color
  }
  return null
}

export function filterImagesByColor(media: MediaItem[], selectedColor: string): MediaItem[] {
  if (!selectedColor) return media
  const target = selectedColor.toLowerCase().trim()
  return media.filter((item) => {
    const color = extractColor(item.alt ?? '')
    if (color === target) return true        // A. 当前颜色 → 显示
    if (color && color !== target) return false  // B. 其他颜色 → 隐藏
    return true                              // C. 通用图 → 显示
  })
}
