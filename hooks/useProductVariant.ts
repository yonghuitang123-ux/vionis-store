'use client'
import { useState, useMemo } from 'react'
import { getAvailableColors } from '@/utils/getAvailableColors'

interface MediaItem { alt?: string | null; image?: { url: string } }
interface Variant {
  id: string
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
  price?: { amount: string; currencyCode: string }
  priceV2?: { amount: string; currencyCode: string }
  compareAtPrice?: { amount: string; currencyCode: string } | null
  compareAtPriceV2?: { amount: string; currencyCode: string } | null
  quantityAvailable?: number
}
interface Option { id: string; name: string; values: string[] }
interface Product {
  options: Option[]
  variants: { nodes?: Variant[] } | Variant[]
}

interface UseProductVariantProps {
  product: Product
  media: MediaItem[]
  initialVariantId?: string | null
}

export function useProductVariant({ product, media, initialVariantId }: UseProductVariantProps) {
  const variants: Variant[] = Array.isArray(product.variants)
    ? product.variants
    : (product.variants as any).nodes ?? []

  const availableColors = useMemo(() => getAvailableColors(media), [media])

  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
  )
  const sizeOption = product.options.find((o) => o.name.toLowerCase() === 'size')

  const initialVariant = initialVariantId
    ? variants.find((v) => v.id.includes(initialVariantId))
    : variants[0]

  const getInitialColor = () => {
    if (initialVariant) {
      const c = initialVariant.selectedOptions.find(
        (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
      )
      if (c) return c.value
    }
    return availableColors[0] ?? colorOption?.values[0] ?? ''
  }

  const getInitialSize = () => {
    if (initialVariant) {
      const s = initialVariant.selectedOptions.find((o) => o.name.toLowerCase() === 'size')
      if (s) return s.value
    }
    return sizeOption?.values[0] ?? ''
  }

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const opts: Record<string, string> = {}
    product.options.forEach((o) => {
      if (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') {
        opts[o.name] = getInitialColor()
      } else if (o.name.toLowerCase() === 'size') {
        opts[o.name] = getInitialSize()
      } else {
        opts[o.name] = o.values[0] ?? ''
      }
    })
    return opts
  })

  const setOption = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  const selectedColor = useMemo(() => {
    if (!colorOption) return ''
    return selectedOptions[colorOption.name] ?? ''
  }, [selectedOptions, colorOption])

  const setSelectedColor = (color: string) => {
    if (colorOption) setOption(colorOption.name, color)
  }

  const selectedSize = useMemo(() => {
    if (!sizeOption) return ''
    return selectedOptions[sizeOption.name] ?? ''
  }, [selectedOptions, sizeOption])

  const setSelectedSize = (size: string) => {
    if (sizeOption) setOption(sizeOption.name, size)
  }

  const selectedVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    )
  }, [variants, selectedOptions])

  const sizeOptions = sizeOption?.values ?? []

  // 兼容 price / priceV2 字段名
  const normalizedVariant = useMemo(() => {
    if (!selectedVariant) return undefined
    const price = selectedVariant.priceV2 ?? selectedVariant.price
    const compareAtPrice = selectedVariant.compareAtPriceV2 ?? selectedVariant.compareAtPrice ?? null
    return {
      ...selectedVariant,
      priceV2: price,
      compareAtPriceV2: compareAtPrice,
    }
  }, [selectedVariant])

  return {
    selectedOptions,
    setOption,
    selectedVariant: normalizedVariant,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    sizeOptions,
    availableColors,
  }
}
