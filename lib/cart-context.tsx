'use client';

/**
 * 全局购物车状态管理
 * ─────────────────────────────────────────────────────────────────
 * 使用 React Context + useReducer 管理购物车状态
 * cartId 持久化到 localStorage，页面刷新后自动恢复购物车
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  createCart,
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from '@/lib/shopify';
import { useToast } from '@/components/Toast';

// ─── 类型定义 ──────────────────────────────────────────────────────────────────

interface CartLine {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string };
  selectedOptions: { name: string; value: string }[];
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  lines: CartLine[];
  totalQuantity: number;
  totalAmount: { amount: string; currencyCode: string } | null;
  subtotalAmount: { amount: string; currencyCode: string } | null;
  loading: boolean;
  drawerOpen: boolean;
}

type CartAction =
  | { type: 'SET_CART'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean };

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

function parseCartLines(cart: any): CartLine[] {
  if (!cart?.lines?.edges) return [];
  return cart.lines.edges.map((e: any) => {
    const node = e.node;
    const merch = node.merchandise;
    return {
      id: node.id,
      quantity: node.quantity,
      title: merch.product.title,
      handle: merch.product.handle,
      variantTitle: merch.title,
      price: merch.priceV2,
      image: merch.image ?? undefined,
      selectedOptions: merch.selectedOptions ?? [],
    };
  });
}

function parseCart(cart: any): Partial<CartState> {
  if (!cart) return {};
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: parseCartLines(cart),
    totalQuantity: cart.totalQuantity ?? 0,
    totalAmount: cart.cost?.totalAmount ?? null,
    subtotalAmount: cart.cost?.subtotalAmount ?? null,
  };
}

// ─── Reducer ───────────────────────────────────────────────────────────────────

const initialState: CartState = {
  cartId: null,
  checkoutUrl: null,
  lines: [],
  totalQuantity: 0,
  totalAmount: null,
  subtotalAmount: null,
  loading: false,
  drawerOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, ...parseCart(action.payload), loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawerOpen: action.payload ?? !state.drawerOpen,
      };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = 'vionis_cart_id';

// ─── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const toast = useToast();

  // 初始化：从 localStorage 恢复购物车，或创建新购物车
  useEffect(() => {
    async function init() {
      const storedId = localStorage.getItem(CART_ID_KEY);
      if (storedId) {
        try {
          const cart = await getCart(storedId);
          if (cart) {
            dispatch({ type: 'SET_CART', payload: cart });
            return;
          }
        } catch {
          localStorage.removeItem(CART_ID_KEY);
        }
      }
      try {
        const cart = await createCart();
        localStorage.setItem(CART_ID_KEY, cart.id);
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        console.error('购物车初始化失败:', err);
      }
    }
    init();
  }, []);

  // 确保有 cartId 再操作
  const ensureCartId = useCallback(async () => {
    if (state.cartId) return state.cartId;
    const cart = await createCart();
    localStorage.setItem(CART_ID_KEY, cart.id);
    dispatch({ type: 'SET_CART', payload: cart });
    return cart.id as string;
  }, [state.cartId]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cartId = await ensureCartId();
        const cart = await apiAddToCart(cartId, variantId, quantity);
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'TOGGLE_DRAWER', payload: true });
        toast.show('Added to cart');
      } catch (err) {
        console.error('添加到购物车失败:', err);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [ensureCartId, toast],
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cart = await apiUpdateCartItem(state.cartId, lineId, quantity);
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        console.error('更新购物车失败:', err);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.cartId],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cart = await apiRemoveCartItem(state.cartId, lineId);
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        console.error('删除购物车商品失败:', err);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.cartId],
  );

  const openDrawer = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER', payload: true }),
    [],
  );
  const closeDrawer = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER', payload: false }),
    [],
  );
  const toggleDrawer = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER' }),
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      updateItem,
      removeItem,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [state, addItem, updateItem, removeItem, openDrawer, closeDrawer, toggleDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart 必须在 CartProvider 内部使用');
  return ctx;
}
