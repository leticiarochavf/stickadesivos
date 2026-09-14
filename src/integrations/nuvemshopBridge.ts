import { Platform } from "react-native";
import { Product } from "../data/products";

const MESSAGE_SOURCE = "stick-adesivos";
const NUVEMSHOP_ORIGIN =
  process.env.EXPO_PUBLIC_NUVEMSHOP_ORIGIN ||
  "https://www.stickadesivos.com.br";

type CartProperties = Record<string, string | number | boolean>;

function parentWindow() {
  if (
    Platform.OS !== "web" ||
    typeof window === "undefined" ||
    window.parent === window
  )
    return null;
  return window.parent;
}

function send(message: Record<string, unknown>) {
  const parent = parentWindow();
  if (!parent) return false;
  parent.postMessage({ source: MESSAGE_SOURCE, ...message }, NUVEMSHOP_ORIGIN);
  return true;
}

function itemFor(
  product: Product,
  quantity: number,
  variantId?: number,
  properties?: CartProperties,
) {
  const resolvedVariantId = variantId || product.nuvemshopVariantId;
  if (!product.nuvemshopProductId || !resolvedVariantId) return null;
  return {
    product_id: product.nuvemshopProductId,
    variant_id: resolvedVariantId,
    quantity,
    ...(properties && Object.keys(properties).length ? { properties } : {}),
  };
}

export function addToNuvemshopCart(
  product: Product,
  quantity: number,
  variant: string,
  variantId?: number,
) {
  const item = itemFor(product, quantity, variantId, {
    Tamanho: variant,
  });
  return item ? send({ type: "cart:add", item }) : false;
}

export function removeFromNuvemshopCart(
  product: Product,
  quantity: number,
  variantId?: number,
) {
  const item = itemFor(product, quantity, variantId);
  return item ? send({ type: "cart:remove", item }) : false;
}

export function openNuvemshopCart() {
  return send({ type: "cart:open" });
}

export function isNuvemshopProduct(product: Product) {
  return Boolean(product.nuvemshopProductId && product.nuvemshopVariantId);
}
