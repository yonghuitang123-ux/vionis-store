import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, type Locale, isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { I18nProvider } from '@/lib/i18n/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // hreflang alternates
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}`;
  }
  languages['x-default'] = `${SITE_URL}/en`;

  return {
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
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

  return (
    <I18nProvider locale={locale as Locale} dict={dict}>
      {children}
    </I18nProvider>
  );
}
