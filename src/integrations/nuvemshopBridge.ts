import { Platform } from "react-native";
import { Product } from "../data/products";

const MESSAGE_SOURCE = "stick-adesivos";
const DEFAULT_NUVEMSHOP_ORIGINS = [
  "https://www.stickadesivos.com.br",
  "https://stickadesivos.com.br",
  "https://stickadesivos.lojavirtualnuvem.com.br",
];
const NUVEMSHOP_ORIGINS = (
  process.env.EXPO_PUBLIC_NUVEMSHOP_ORIGINS ||
  DEFAULT_NUVEMSHOP_ORIGINS.join(",")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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

export function getNuvemshopParentOrigin() {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (NUVEMSHOP_ORIGINS.includes(referrerOrigin)) return referrerOrigin;
    } catch {
      // Acesso direto ao frontend não possui um referrer da loja.
    }
  }
  return NUVEMSHOP_ORIGINS[0];
}

function send(message: Record<string, unknown>) {
  const parent = parentWindow();
  if (!parent) return false;
  parent.postMessage(
    { source: MESSAGE_SOURCE, ...message },
    getNuvemshopParentOrigin(),
  );
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

