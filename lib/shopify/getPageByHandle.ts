import { shopify } from '@/lib/shopify';
import { PAGE_BY_HANDLE_QUERY } from './queries/page';

export interface PageByHandle {
  title: string;
  body: string;
  seo: { title: string | null; description: string | null } | null;
}

export async function getPageByHandle(handle: string): Promise<PageByHandle | null> {
  try {
    const { data } = await shopify.request(PAGE_BY_HANDLE_QUERY, {
      variables: { handle },
    });
    return data?.page ?? null;
  } catch {
    return null;
  }
}
