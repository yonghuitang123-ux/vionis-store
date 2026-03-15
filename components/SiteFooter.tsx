'use client';

import React from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
import Link from 'next/link';
import { FormEvent, useId, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavLink { title: string; url: string; }

export type FooterBlock =
  | { type: 'link_list'; heading?: string; links: NavLink[] }
  | { type: 'text'; heading?: string; content: string /* HTML or plain */ }
  | { type: 'brand_information'; showSocial?: boolean }
  | { type: 'image'; imageUrl: string; imageAlt?: string; imageWidth?: number; alignment?: '' | 'center' | 'right' };

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  pinterest?: string;
  snapchat?: string;
  vimeo?: string;
}

export interface BrandInfo {
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  headline?: string;
  description?: string;
}

export interface PolicyLink { title: string; url: string; }

/** 支付图标：传入图片 URL（可使用 CDN 上的 SVG/PNG） */
export interface PaymentIcon { name: string; url: string; }

export interface FooterColors {
  bgColor: string;
  textColor: string;
  headingColor: string;
  mutedColor: string;
  borderColor: string;
  linkColor: string;
  inputBorderColor: string;
  btnBg: string;
  btnColor: string;
}

export interface SiteFooterProps {
  blocks?: FooterBlock[];
  brandInfo?: BrandInfo;

  showNewsletter?: boolean;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  /** 接收 email 字符串，返回 Promise（成功 resolve，失败 reject 并带错误信息） */
  onNewsletterSubmit?: (email: string) => Promise<void>;

  showSocial?: boolean;
  socialLinks?: SocialLinks;

  showPaymentIcons?: boolean;
  paymentIcons?: PaymentIcon[];
  showPolicies?: boolean;
  policies?: PolicyLink[];
  shopName?: string;
  shopUrl?: string;

  colors?: Partial<FooterColors>;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
}

// ─── URL Normalizer ───────────────────────────────────────────────────────────
// 把任何指向 myshopify.com / shopify.com 的绝对链接转成相对路径，
// 避免链接跳出 Next.js 路由。
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes('myshopify.com') ||
      parsed.hostname.includes('shopify.com')
    ) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch {
    // 已经是相对路径，直接返回
  }
  return url;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: FooterColors = {
  bgColor: '#E8DFD6',
  textColor: '#555555',
  headingColor: '#1a1a1a',
  mutedColor: '#888888',
  borderColor: 'rgba(0,0,0,0.1)',
  linkColor: '#333333',
  inputBorderColor: 'rgba(0,0,0,0.2)',
  btnBg: '#1a1a1a',
  btnColor: '#FFFFFF',
};

// ─── Inline Social SVG Icons ──────────────────────────────────────────────────

function IconInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function IconPinterest() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988 0-6.621-5.366-11.99-11.99-11.99z"/>
    </svg>
  );
}

// 社交平台图标映射
const SOCIAL_ICON_MAP: Record<keyof SocialLinks, React.ReactElement> = {
  instagram: <IconInstagram />,
  facebook: <IconFacebook />,
  twitter: <IconTwitter />,
  youtube: <IconYoutube />,
  tiktok: <IconTiktok />,
  pinterest: <IconPinterest />,
  snapchat: <span className="text-xs font-bold leading-none">SC</span>,
  vimeo: <span className="text-xs font-bold leading-none">Vi</span>,
};

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter / X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  snapchat: 'Snapchat',
  vimeo: 'Vimeo',
};

// ─── Sub: Social Icons Row ────────────────────────────────────────────────────

function SocialRow({ links, linkColor }: { links: SocialLinks; linkColor: string }) {
  const entries = (Object.keys(links) as (keyof SocialLinks)[]).filter(k => links[k]);
  if (!entries.length) return null;
  return (
    <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
      {entries.map(key => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={SOCIAL_LABELS[key]}
            className="flex items-center justify-center w-9 h-9 rounded-full border transition-opacity duration-200 hover:opacity-70"
            style={{ color: linkColor, borderColor: 'rgba(0,0,0,0.15)' }}
          >
            {SOCIAL_ICON_MAP[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}

// ─── Sub: Newsletter Form ─────────────────────────────────────────────────────

function NewsletterForm({
  heading,
  placeholder,
  onSubmit,
  colors: c,
}: {
  heading?: string;
  placeholder?: string;
  onSubmit?: (email: string) => Promise<void>;
  colors: FooterColors;
}) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      await onSubmit?.(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '订阅失败，请重试');
    }
  }

  return (
    <div>
      {heading && (
        <h2 className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: c.headingColor }}>
          {heading}
        </h2>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-0 relative">
          <label htmlFor={inputId} className="sr-only">
            {placeholder ?? 'Email address'}
          </label>
          <input
            id={inputId}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={placeholder ?? 'Email address'}
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent border"
            style={{
              color: c.textColor,
              borderColor: c.inputBorderColor,
              borderRight: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-5 py-3 text-sm font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-80 disabled:opacity-50 shrink-0"
            style={{ backgroundColor: c.btnBg, color: c.btnColor }}
            aria-label="Subscribe"
          >
            {status === 'loading' ? '…' : '→'}
          </button>
        </div>

        {status === 'error' && (
          <p className="mt-2 text-xs" style={{ color: '#ff6b6b' }}>
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p className="mt-2 text-xs" style={{ color: '#6bff9e' }}>
            感谢订阅！
          </p>
        )}
      </form>
    </div>
  );
}

// ─── Sub: Single Block Renderer ───────────────────────────────────────────────

function BlockRenderer({
  block,
  brandInfo,
  socialLinks,
  colors: c,
}: {
  block: FooterBlock;
  brandInfo?: BrandInfo;
  socialLinks?: SocialLinks;
  colors: FooterColors;
}) {
  const headingEl = (text?: string) =>
    text ? (
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: c.headingColor }}>
        {text}
      </h2>
    ) : null;

  switch (block.type) {
    case 'link_list':
      return (
        <div>
          {headingEl(block.heading)}
          <ul className="space-y-2.5 list-none p-0 m-0">
            {block.links.map((link) => (
              <li key={link.url}>
                <Link
                  href={normalizeUrl(link.url)}
                  className="text-sm transition-opacity duration-200 hover:opacity-70"
                  style={{ color: c.linkColor }}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'text':
      return (
        <div>
          {headingEl(block.heading)}
          <div
            className="text-sm leading-relaxed"
            style={{ color: c.textColor }}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      );

    case 'brand_information':
      return (
        <div className="space-y-4">
          {brandInfo?.logoUrl && (
            <div style={{ maxWidth: brandInfo.logoWidth ?? 160 }}>
              <PlaceholderImage
                src={brandInfo.logoUrl}
                alt={brandInfo.logoAlt ?? ''}
                width={brandInfo.logoWidth ?? 160}
                height={40}
                className="object-contain"
                loading="lazy"
              />
            </div>
          )}
          {brandInfo?.headline && (
            <h2 className="text-sm font-medium" style={{ color: c.headingColor }}>
              {brandInfo.headline}
            </h2>
          )}
          {brandInfo?.description && (
            <p className="text-sm leading-relaxed" style={{ color: c.textColor }}>
              {brandInfo.description}
            </p>
          )}
          {block.showSocial && socialLinks && (
            <SocialRow links={socialLinks} linkColor={c.linkColor} />
          )}
        </div>
      );

    case 'image': {
      const alignClass =
        block.alignment === 'center'
          ? 'mx-auto'
          : block.alignment === 'right'
          ? 'ml-auto'
          : '';
      return (
        <div className={`${alignClass}`} style={{ maxWidth: block.imageWidth ?? 100 }}>
          <PlaceholderImage
            src={block.imageUrl}
            alt={block.imageAlt ?? ''}
            width={block.imageWidth ?? 100}
            height={60}
            className="object-contain"
            loading="lazy"
          />
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SiteFooter({
  blocks = [],
  brandInfo,
  showNewsletter = true,
  newsletterHeading = 'Stay in touch',
  newsletterPlaceholder = 'Email address',
  onNewsletterSubmit,
  showSocial = true,
  socialLinks,
  showPaymentIcons = false,
  paymentIcons = [],
  showPolicies = true,
  policies = [],
  shopName = 'Store',
  shopUrl = '/',
  colors: colorsProp,
  paddingTop = 60,
  paddingBottom = 36,
  marginTop = 0,
}: SiteFooterProps) {
  const c: FooterColors = { ...DEFAULT_COLORS, ...colorsProp };
  const year = new Date().getFullYear();

  const hasTop =
    blocks.length > 0 ||
    showNewsletter ||
    (showSocial && !!socialLinks && Object.values(socialLinks).some(Boolean));

  return (
    <footer
      style={{
        backgroundColor: c.bgColor,
        color: c.textColor,
        marginTop,
      }}
    >
      {/* ── Top: Blocks + Newsletter ── */}
      {hasTop && (
        <div
          className="max-w-[1400px] mx-auto px-6 md:px-[30px]"
          style={{ paddingTop, paddingBottom }}
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Block grid */}
            {blocks.length > 0 && (
              <div
                className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 min-w-0"
              >
                {blocks.map((block, idx) => (
                  <BlockRenderer
                    key={idx}
                    block={block}
                    brandInfo={brandInfo}
                    socialLinks={socialLinks}
                    colors={c}
                  />
                ))}
              </div>
            )}

            {/* Newsletter + Social column */}
            {(showNewsletter || (showSocial && socialLinks)) && (
              <div className="shrink-0 lg:w-72 space-y-6">
                {showNewsletter && (
                  <NewsletterForm
                    heading={newsletterHeading}
                    placeholder={newsletterPlaceholder}
                    onSubmit={onNewsletterSubmit}
                    colors={c}
                  />
                )}
                {showSocial && socialLinks && Object.values(socialLinks).some(Boolean) && (
                  <SocialRow links={socialLinks} linkColor={c.linkColor} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ borderTop: `1px solid ${c.borderColor}` }} />

      {/* ── Bottom bar ── */}
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-[30px] py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Copyright */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: c.mutedColor }}>
          <span>
            &copy; {year}&nbsp;
            <Link href={shopUrl} className="hover:opacity-70 transition-opacity" style={{ color: c.mutedColor }}>
              {shopName}
            </Link>
          </span>

          {showPolicies && policies.map((p) => (
            <Link
              key={p.url}
              href={normalizeUrl(p.url)}
              className="hover:opacity-70 transition-opacity"
              style={{ color: c.mutedColor }}
            >
              {p.title}
            </Link>
          ))}
        </div>

        {/* Payment icons */}
        {showPaymentIcons && paymentIcons.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
            {paymentIcons.map((icon) => (
              <li key={icon.name}>
                <PlaceholderImage
                  src={icon.url}
                  alt={icon.name}
                  width={38}
                  height={24}
                  className="object-contain rounded"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
