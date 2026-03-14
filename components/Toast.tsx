'use client';

/**
 * 全局 Toast 提示组件
 * ─────────────────────────────────────────────────────────────────
 * 通过 Context 控制显示，用于加入购物车成功等提示
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ToastState {
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  show: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>({ message: '', visible: false });

  const show = useCallback((message: string, duration = 3000) => {
    setState({ message, visible: true });
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, visible: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {state.visible && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '14px 28px',
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 13,
            letterSpacing: '0.04em',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            animation: 'toast-in 0.35s ease',
          }}
        >
          <style>{`
            @keyframes toast-in {
              from { opacity: 0; transform: translateX(-50%) translateY(12px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
          {state.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { show: () => {} };
  return ctx;
}
