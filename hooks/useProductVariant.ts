'use client';

/**
 * useProductVariant — 产品变体选择状态管理
 * ─────────────────────────────────────────────────────────────────
 * 管理 selectedOptions（颜色、尺码等），暴露 selectedColor / selectedSize 及对应 setter。
 */

import { useCallback, useMemo, useState } from 'react';

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: SelectedOption[];
  image?: { url: string; altText?: string | null } | null;
  priceV2?: { amount: string; currencyCode: string };
  compareAtPriceV2?: { amount: string; currencyCode: string } | null;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductForVariant {
  options: ProductOption[];
  variants: ProductVariant[];
}

/** 根据已选 options 查找匹配的 variant */
function findVariant(
  variants: ProductVariant[],
  selections: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every((opt) => selections[opt.name] === opt.value),
  );
}

/** 检测选项名是否为颜色 */
function isColorOption(name: string): boolean {
  const n = name.toLowerCase();
  return n === 'color' || n === 'colour';
}

/** 检测选项名是否为尺码 */
function isSizeOption(name: string): boolean {
  return name.toLowerCase() === 'size';
}

export interface UseProductVariantOptions {
  product: ProductForVariant;
  initialVariantId?: string | null;
}

export interface UseProductVariantReturn {
  selectedOptions: Record<string, string>;
  setOption: (name: string, value: string) => void;
  selectedVariant: ProductVariant | undefined;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  colorOptions: string[];
  sizeOptions: string[];
}

export function useProductVariant({
  product,
  initialVariantId,
}: UseProductVariantOptions): UseProductVariantReturn {
  const colorOpt = product.options.find((o) => isColorOption(o.name));
  const sizeOpt = product.options.find((o) => isSizeOption(o.name));

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      if (initialVariantId) {
        const v = product.variants.find(
          (x) => x.id === initialVariantId || x.id.endsWith(initialVariantId),
        );
        if (v?.selectedOptions) {
          v.selectedOptions.forEach((o) => {
            initial[o.name] = o.value;
          });
          return initial;
        }
      }
      product.options.forEach((opt) => {
        initial[opt.name] = opt.values[0] ?? '';
      });
      return initial;
    },
  );

  const setOption = useCallback(
    (name: string, value: string) => {
      setSelectedOptions((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions],
  );

  const selectedColor = colorOpt ? selectedOptions[colorOpt.name] ?? null : null;
  const selectedSize = sizeOpt ? selectedOptions[sizeOpt.name] ?? null : null;

  const setSelectedColor = useCallback(
    (color: string | null) => {
      if (colorOpt) setOption(colorOpt.name, color ?? colorOpt.values[0] ?? '');
    },
    [colorOpt, setOption],
  );

  const setSelectedSize = useCallback(
    (size: string | null) => {
      if (sizeOpt) setOption(sizeOpt.name, size ?? sizeOpt.values[0] ?? '');
    },
    [sizeOpt, setOption],
  );

  const colorOptions = colorOpt?.values ?? [];
  const sizeOptions = sizeOpt?.values ?? [];

  return {
    selectedOptions,
    setOption,
    selectedVariant,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    colorOptions,
    sizeOptions,
  };
}
