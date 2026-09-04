"use server";

import { getCartOwner } from "@/lib/auth";
import { AppError, runAction } from "@/lib/errors";
import {
  mockProducts,
  mockLicenses,
} from "@/server/mock-data";
import {
  addMockCartItem,
  clearMockCart,
  getMockCartItems,
  removeMockCartItem,
} from "@/server/mock-store";

export async function addToCartAction(
  productId: number,
  licenseId: number,
) {
  return runAction(async () => {
    const owner = await getCartOwner(true);

    const product = mockProducts.find(
      (item) =>
        item.id === productId &&
        item.status === "PUBLISHED",
    );

    if (!product) {
      throw new AppError(
        "این محصول در دسترس نیست.",
      );
    }

    const license = mockLicenses.find(
      (item) => item.id === licenseId,
    );

    if (!license) {
      throw new AppError(
        "نوع لایسنس نامعتبر است.",
      );
    }

    const result = addMockCartItem(
      owner,
      productId,
      licenseId,
    );

    const items = getMockCartItems(owner);

    if (result.alreadyExists) {
      return {
        added: false,
        alreadyInCart: true,
        count: items.length,
      };
    }

    return {
      added: true,
      alreadyInCart: false,
      count: items.length,
    };
  });
}

export async function removeFromCartAction(
  cartItemId: number,
) {
  return runAction(async () => {
    const owner = await getCartOwner(false);

    if (
      "sessionKey" in owner &&
      !owner.sessionKey
    ) {
      return {
        count: 0,
      };
    }

    removeMockCartItem(
      owner,
      cartItemId,
    );

    const items = getMockCartItems(owner);

    return {
      count: items.length,
    };
  });
}

export async function clearCartAction() {
  return runAction(async () => {
    const owner = await getCartOwner(false);

    if (
      "sessionKey" in owner &&
      !owner.sessionKey
    ) {
      return {};
    }

    clearMockCart(owner);

    return {};
  });
}