import { NextRequest, NextResponse } from 'next/server';
import { getBlogArticles } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const after = searchParams.get('after') || undefined;
  const first = Math.min(Number(searchParams.get('first') || '12'), 50);

  try {
    const { articles, pageInfo } = await getBlogArticles('journal', first, after);
    return NextResponse.json({
      articles: articles.map((a: any) => ({
        slug: a.handle,
        title: a.title,
        excerpt: a.excerpt || '',
        date: a.publishedAt || '',
        image: a.image?.url || '',
      })),
      pageInfo,
    });
  } catch {
    return NextResponse.json({ articles: [], pageInfo: { hasNextPage: false, endCursor: null } });
  }
}
