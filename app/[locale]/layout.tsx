import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, type Locale, isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { I18nProvider } from '@/lib/i18n/client';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import Header from '@/components/Header';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').replace(/\/+$/, '');

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
    description:
      'Handcrafted luxury knitwear from the finest natural fibres. Premium cashmere and merino wool.',
    alternates: buildAlternates(''),
    openGraph: {
      title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
      description: 'Handcrafted luxury knitwear from the finest natural fibres.',
      siteName: 'VIONIS·XY',
      locale,
      images: [defaultOgImage],
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  // Organization + WebSite JSON-LD（全站共享，仅注入一次）
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VIONIS·XY',
    url: SITE_URL,
    logo: `${SITE_URL}/LOGO.png`,
    description: 'Handcrafted luxury knitwear from the finest natural fibres. Premium cashmere and merino wool.',
    sameAs: [],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VIONIS·XY',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${locale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <I18nProvider locale={locale as Locale} dict={dict}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header />
      {/* Mobile: announcement(36) + nav(56) = 92px; Desktop: + logo(~96) = 188px */}
      <div className="pt-[92px] xl:pt-[188px]">{children}</div>
    </I18nProvider>
  );
}
