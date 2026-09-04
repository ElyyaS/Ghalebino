export const PLATFORM_FEE_RATE = 0.2;

export function splitSellerShare(finalPrice: number): {
  sellerShare: number;
  platformFee: number;
} {
  const platformFee = Math.round(finalPrice * PLATFORM_FEE_RATE);
  return { sellerShare: finalPrice - platformFee, platformFee };
}

export function effectivePrice(price: number, salePrice: number | null): number {
  return salePrice != null && salePrice < price ? salePrice : price;
}

export function applyCoupon(
  amount: number,
  coupon: { type: "PERCENT" | "FIXED"; value: number } | null,
): number {
  if (!coupon) return 0;
  if (coupon.type === "FIXED") return Math.min(amount, coupon.value);
  return Math.round((amount * Math.min(100, coupon.value)) / 100);
}
