'use client';

/**
 * Wishlist 全局状态管理
 * ─────────────────────────────────────────────────────────────────
 * - 未登录：localStorage 持久化
 * - 已登录：localStorage + 服务器同步（通过 API）
 * - 登录时自动合并本地收藏到账号
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// ─── 类型定义 ──────────────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string;
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  compareAtPrice?: string;
  image?: string;
  imageAlt?: string;
  addedAt: string;         // ISO timestamp
  variantInfo?: string;    // e.g. "Oatmeal / S"
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isInWishlist: (productId: string) => boolean;
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearAll: () => void;
}

// ─── localStorage 键 ────────────────────────────────────────────────────────

const STORAGE_KEY = 'vionis_wishlist';

function loadFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or disabled
  }
}

// ─── Cookie 工具 ────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── 服务器同步 ────────────────────────────────────────────────────────────────

async function syncToServer(items: WishlistItem[], token: string) {
  try {
    await fetch('/api/wishlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, items }),
    });
  } catch {
    // fail silently, localStorage is the fallback
  }
}

async function fetchFromServer(token: string): Promise<WishlistItem[] | null> {
  try {
    const res = await fetch(`/api/wishlist?token=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.items ?? null;
  } catch {
    return null;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 初始化：从 localStorage 加载 + 如果已登录则合并服务器数据
  useEffect(() => {
    const localItems = loadFromStorage();
    const token = getCookie('vionis_customer_token');

    if (token) {
      // 已登录：合并本地 + 服务器
      fetchFromServer(token).then((serverItems) => {
        if (serverItems) {
          const merged = mergeItems(localItems, serverItems);
          setItems(merged);
          saveToStorage(merged);
          syncToServer(merged, token);
        } else {
          setItems(localItems);
        }
        setHydrated(true);
      });
    } else {
      setItems(localItems);
      setHydrated(true);
    }
  }, []);

  // items 变化时持久化
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(items);
    const token = getCookie('vionis_customer_token');
    if (token) syncToServer(items, token);
  }, [items, hydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const addItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev;
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggleItem = useCallback(
    (item: Omit<WishlistItem, 'addedAt'>) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === item.productId);
        if (exists) return prev.filter((i) => i.productId !== item.productId);
        return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
      });
    },
    [],
  );

  const clearAll = useCallback(() => setItems([]), []);

  const count = items.length;

  const value = useMemo(
    () => ({ items, count, isInWishlist, addItem, removeItem, toggleItem, clearAll }),
    [items, count, isInWishlist, addItem, removeItem, toggleItem, clearAll],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

// ─── 合并去重 ────────────────────────────────────────────────────────────────

function mergeItems(local: WishlistItem[], server: WishlistItem[]): WishlistItem[] {
  const map = new Map<string, WishlistItem>();
  // server first, local overrides (local is more recent)
  for (const item of server) map.set(item.productId, item);
  for (const item of local) map.set(item.productId, item);
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );
}
