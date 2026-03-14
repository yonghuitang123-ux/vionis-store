'use client';

/**
 * 注册页 — 客户端组件
 * ─────────────────────────────────────────────────────────────────
 * 调用 Shopify Storefront API 创建客户账户，
 * 成功后自动登录并跳转到 /account。
 */

import { useState, type FormEvent, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createCustomer, loginCustomer } from '@/lib/shopify';

// ─── 样式常量 ──────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
};

const formContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: 400,
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 400,
  letterSpacing: '0.1em',
  textAlign: 'center',
  color: '#1a1a1a',
  marginBottom: 8,
};

const subtitleStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 300,
  textAlign: 'center',
  color: '#888',
  marginBottom: 40,
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
  marginBottom: 8,
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 300,
  color: '#1a1a1a',
  backgroundColor: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(0,0,0,0.12)',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const buttonStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#fff',
  backgroundColor: '#1a1a1a',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  marginTop: 8,
};

const errorStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  color: '#c0392b',
  textAlign: 'center',
  marginBottom: 16,
};

const linkRowStyle: CSSProperties = {
  textAlign: 'center',
  marginTop: 28,
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 300,
  color: '#888',
};

const linkStyle: CSSProperties = {
  color: '#A05E46',
  textDecoration: 'none',
  fontWeight: 500,
  marginLeft: 4,
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  marginBottom: 20,
};

// ─── 工具函数：设置 Cookie ──────────────────────────────────────────────────

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 注册新账户
      const result = await createCustomer(email, password, firstName, lastName);

      if (result.customerUserErrors?.length > 0) {
        setError(result.customerUserErrors[0].message);
        setLoading(false);
        return;
      }

      // 注册成功后自动登录
      const loginResult = await loginCustomer(email, password);
      const token = loginResult.customerAccessToken?.accessToken;
      if (token) {
        setCookie('vionis_customer_token', token, 30);
      }

      router.push('/account');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join the VIONIS·XY community</p>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* 姓名 */}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
                placeholder="First"
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
                placeholder="Last"
              />
            </div>
          </div>

          {/* 邮箱 */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="your@email.com"
            />
          </div>

          {/* 密码 */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="At least 5 characters"
            />
          </div>

          {/* 注册按钮 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* 登录链接 */}
        <p style={linkRowStyle}>
          Already have an account?
          <Link href="/account/login" style={linkStyle}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
