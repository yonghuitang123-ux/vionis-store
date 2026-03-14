import { COLORS } from '@/constants/colors'

interface MediaItem {
  alt?: string | null
  url?: string
  image?: { url: string; width?: number; height?: number }
}

function extractColor(alt: string): string | null {
  const match = alt.match(/\bin\s+([^,]+)/i)
  if (!match) return null
  const c = match[1].toLowerCase().trim()
  return COLORS.includes(c as any) ? c : null
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
