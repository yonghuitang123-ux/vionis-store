'use client';

import { useState, useEffect } from 'react';

// ─── 公开评论类型（前端用） ─────────────────────────────────────────────────────

export interface PublicReview {
  id: string;
  productId: string;
  productTitle: string;
  displayName: string;
  country: string;
  countryFlag: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verified: boolean;
  productInfo: string;
  createdAt: string;
}

// ─── 内存缓存 ───────────────────────────────────────────────────────────────────

const cache: Record<string, PublicReview[]> = {};

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<PublicReview[]>(
    cache[productId] || [],
  );
  const [loading, setLoading] = useState(!cache[productId]);

  useEffect(() => {
    if (cache[productId]) {
      setReviews(cache[productId]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
      .then((r) => r.json())
      .then((data: PublicReview[]) => {
        if (cancelled) return;
        cache[productId] = data;
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  /** 手动刷新缓存 */
  const refetch = () => {
    delete cache[productId];
    setLoading(true);
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
      .then((r) => r.json())
      .then((data: PublicReview[]) => {
        cache[productId] = data;
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return { reviews, loading, refetch };
}
