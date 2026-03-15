'use client';

import { useWishlist, type WishlistItem } from '@/lib/wishlist-context';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function WishlistPage() {
  const { items, removeItem, clearAll, count } = useWishlist();

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '140px 30px 80px',
        minHeight: '80vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 48,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: 20,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif',
            fontSize: 36,
            fontWeight: 300,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          Wishlist
        </h1>
        {count > 0 && (
          <button
            onClick={clearAll}
            style={{
              fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {count === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <svg
            width={48}
            height={48}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ccc"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: 24 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 20.9l7.84-7.84a5.5 5.5 0 0 0 0-7.45z" />
          </svg>
          <p
            style={{
              fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
              fontSize: 13,
              color: '#999',
              letterSpacing: '0.06em',
              marginBottom: 32,
            }}
          >
            Your wishlist is empty
          </p>
          <Link
            href="/collections/new-arrivals"
            style={{
              fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#1a1a1a',
              textDecoration: 'none',
              padding: '14px 40px',
              border: '1px solid #1a1a1a',
              display: 'inline-block',
              transition: 'all 0.3s ease',
            }}
          >
            Explore Collection
          </Link>
        </div>
      )}

      {/* Wishlist Grid */}
      {count > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {items.map((item) => (
            <WishlistCard key={item.productId} item={item} onRemove={removeItem} />
          ))}
        </div>
      )}
    </main>
  );
}

// ─── Wishlist Card ────────────────────────────────────────────────────────────

function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
}) {
  const [imgHover, setImgHover] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.productId)}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        aria-label={`Remove ${item.title} from wishlist`}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,1)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
      >
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Image */}
      <Link href={`/products/${item.handle}`} style={{ display: 'block' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/5',
            backgroundColor: '#f0ede8',
            overflow: 'hidden',
            marginBottom: 16,
          }}
          onMouseEnter={() => setImgHover(true)}
          onMouseLeave={() => setImgHover(false)}
        >
          {item.image && (
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.title}
              fill
              sizes="(max-width:768px) 50vw, 280px"
              style={{
                objectFit: 'cover',
                transform: imgHover ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            />
          )}
        </div>
      </Link>

      {/* Info */}
      <Link href={`/products/${item.handle}`} style={{ textDecoration: 'none' }}>
        <p
          style={{
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: '#1a1a1a',
            letterSpacing: '0.04em',
            margin: '0 0 6px',
            lineHeight: 1.5,
          }}
        >
          {item.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
              fontSize: 12,
              fontWeight: 400,
              color: '#1a1a1a',
            }}
          >
            ${parseFloat(item.price).toFixed(0)}
          </span>
          {item.compareAtPrice && parseFloat(item.compareAtPrice) > parseFloat(item.price) && (
            <span
              style={{
                fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                fontSize: 11,
                color: '#aaa',
                textDecoration: 'line-through',
              }}
            >
              ${parseFloat(item.compareAtPrice).toFixed(0)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
