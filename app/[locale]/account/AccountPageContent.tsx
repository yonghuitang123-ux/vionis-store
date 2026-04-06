'use client';

/**
 * 账户仪表盘 — 客户端组件
 * ─────────────────────────────────────────────────────────────────
 * 读取 cookie 中的 access token，获取客户信息和订单历史。
 * 无 token 时自动重定向到登录页。
 */

import { useEffect, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomer, getCustomerOrders } from '@/lib/shopify';

// ─── 工具函数：Cookie 操作 ──────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)'),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// ─── 样式常量 ──────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
  padding: '40px 24px 80px',
};

const containerStyle: CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 400,
  letterSpacing: '0.1em',
  color: '#1a1a1a',
  textAlign: 'center',
  marginBottom: 8,
};

const subtitleStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 300,
  color: '#666',
  textAlign: 'center',
  marginBottom: 48,
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 24,
  fontWeight: 500,
  color: '#1a1a1a',
  marginBottom: 20,
  paddingBottom: 12,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

const cardStyle: CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.45)',
  padding: '32px',
  marginBottom: 32,
};

const infoRowStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 300,
  color: '#333',
  marginBottom: 8,
  display: 'flex',
  gap: 8,
};

const infoLabelStyle: CSSProperties = {
  fontWeight: 500,
  color: '#1a1a1a',
  minWidth: 60,
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 300,
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#666',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

const tdStyle: CSSProperties = {
  padding: '14px 16px',
  color: '#333',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
};

const buttonStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#fff',
  backgroundColor: '#1a1a1a',
  border: 'none',
  padding: '14px 32px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const loadingStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 300,
  color: '#666',
  textAlign: 'center',
  paddingTop: 120,
};

const emptyStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 300,
  color: '#666',
  padding: '24px 0',
};

// ─── 日期格式化 ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default function AccountPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = getCookie('vionis_customer_token');
    if (!token) {
      router.replace('/account/login');
      return;
    }

    // 并行获取客户信息和订单
    Promise.all([getCustomer(token), getCustomerOrders(token)])
      .then(([cust, ords]) => {
        if (!cust) {
          // token 无效或过期
          deleteCookie('vionis_customer_token');
          router.replace('/account/login');
          return;
        }
        setCustomer(cust);
        setOrders(ords);
        setLoading(false);
      })
      .catch(() => {
        deleteCookie('vionis_customer_token');
        router.replace('/account/login');
      });
  }, [router]);

  function handleSignOut() {
    deleteCookie('vionis_customer_token');
    router.push('/');
  }

  // 加载中
  if (loading) {
    return (
      <div style={pageStyle}>
        <p style={loadingStyle}>Loading your account…</p>
      </div>
    );
  }

  const displayName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') ||
    'Customer';

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* 欢迎标题 */}
        <h1 style={titleStyle}>Welcome, {displayName}</h1>
        <p style={subtitleStyle}>{customer?.email}</p>

        {/* 账户信息 */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Account Details</h2>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Name</span>
            <span>{displayName}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Email</span>
            <span>{customer?.email}</span>
          </div>
          {customer?.phone && (
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Phone</span>
              <span>{customer.phone}</span>
            </div>
          )}
          {customer?.defaultAddress && (
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Address</span>
              <span>
                {[
                  customer.defaultAddress.address1,
                  customer.defaultAddress.city,
                  customer.defaultAddress.province,
                  customer.defaultAddress.zip,
                  customer.defaultAddress.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* 订单历史 */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Order History</h2>

          {orders.length === 0 ? (
            <p style={emptyStyle}>You haven&apos;t placed any orders yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Items</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>
                        #{order.orderNumber}
                      </td>
                      <td style={tdStyle}>
                        {order.processedAt
                          ? formatDate(order.processedAt)
                          : '—'}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            fontSize: 11,
                            letterSpacing: '0.05em',
                            backgroundColor: 'rgba(160,94,70,0.1)',
                            color: '#A05E46',
                          }}
                        >
                          {formatStatus(
                            order.fulfillmentStatus || order.financialStatus || 'PENDING',
                          )}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {order.lineItems?.edges
                          ?.map((e: any) => `${e.node.title} ×${e.node.quantity}`)
                          .join(', ') || '—'}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>
                        {order.totalPrice?.currencyCode}{' '}
                        {parseFloat(order.totalPrice?.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 退出按钮 */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={handleSignOut}
            style={buttonStyle}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
