import { shopify } from '@/lib/shopify';
import { SHOP_POLICIES_QUERY } from './queries/policies';

export interface ShopPolicy {
  title: string;
  body: string;
}

export interface ShopPolicies {
  privacyPolicy: ShopPolicy | null;
  refundPolicy: ShopPolicy | null;
  shippingPolicy: ShopPolicy | null;
  termsOfService: ShopPolicy | null;
}

export async function getPolicies(): Promise<ShopPolicies> {
  try {
    const { data } = await shopify.request(SHOP_POLICIES_QUERY);
    const shop = data?.shop ?? {};
    return {
      privacyPolicy: shop.privacyPolicy ?? null,
      refundPolicy: shop.refundPolicy ?? null,
      shippingPolicy: shop.shippingPolicy ?? null,
      termsOfService: shop.termsOfService ?? null,
    };
  } catch {
    return {
      privacyPolicy: null,
      refundPolicy: null,
      shippingPolicy: null,
      termsOfService: null,
    };
  }
}
