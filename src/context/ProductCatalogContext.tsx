import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ImageSourcePropType, Platform } from "react-native";
import { Product, products as fallbackProducts } from "../data/products";

type ApiProduct = Omit<Product, "image"> & { imageUrl?: string };

type ProductCatalogValue = {
  products: Product[];
  usingNuvemshop: boolean;
};

const ProductCatalogContext = createContext<ProductCatalogValue>({
  products: fallbackProducts,
  usingNuvemshop: false,
});

function isApiProduct(value: unknown): value is ApiProduct {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "number" &&
    typeof product.slug === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    typeof product.nuvemshopProductId === "number" &&
    typeof product.nuvemshopVariantId === "number"
  );
}

export function ProductCatalogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const configuredURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
    const baseURL =
      configuredURL ||
      (Platform.OS === "web" && typeof window !== "undefined"
        ? window.location.origin
        : "");
    if (!baseURL) return;

    const controller = new AbortController();
    fetch(`${baseURL}/api/products`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catálogo indisponível");
        return response.json() as Promise<{ products?: unknown[] }>;
      })
      .then(({ products }) => {
        if (!Array.isArray(products)) return;
        const parsed = products.filter(isApiProduct).map((product) => ({
          ...product,
          image: product.imageUrl
            ? ({ uri: product.imageUrl } as ImageSourcePropType)
            : fallbackProducts[0].image,
        }));
        if (parsed.length) setRemoteProducts(parsed);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const value = useMemo<ProductCatalogValue>(
    () => ({
      products: remoteProducts ?? fallbackProducts,
      usingNuvemshop: Boolean(remoteProducts),
    }),
    [remoteProducts],
  );

  return (
    <ProductCatalogContext.Provider value={value}>
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  return useContext(ProductCatalogContext);
}
