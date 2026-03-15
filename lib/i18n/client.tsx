'use client';

/**
 * 客户端 i18n Context + Hook
 * ─────────────────────────────────────────────────────────────────
 * 提供 useTranslation() 给所有客户端组件使用
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Locale } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>;

interface I18nContextValue {
  locale: Locale;
  /** 翻译函数 — 支持嵌套 key（如 "nav.home"）和参数替换（如 "{count} items"） */
  t: (key: string, params?: Record<string, string | number>) => string;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}

export function I18nProvider({ locale, dict, children }: I18nProviderProps) {
  const value = useMemo(() => {
    const t = (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = dict;
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return key; // fallback to key
      }
      if (typeof result !== 'string') return key;
      if (params) {
        return result.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
      }
      return result;
    };
    return { locale, t, dict };
  }, [locale, dict]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** 默认 fallback（未在 I18nProvider 内时返回英语默认值） */
const fallback: I18nContextValue = {
  locale: 'en',
  t: (key: string) => {
    // 返回 key 的最后一段作为 fallback 显示
    const parts = key.split('.');
    return parts[parts.length - 1];
  },
  dict: {},
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  return ctx ?? fallback;
}
