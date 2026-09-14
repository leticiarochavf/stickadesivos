function localized(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return (
    value.pt ||
    value["pt-BR"] ||
    value.es ||
    value.en ||
    Object.values(value).find((entry) => typeof entry === "string") ||
    ""
  );
}

function plainText(value) {
  return localized(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function publicProduct(product, index) {
  const sourceVariants = Array.isArray(product.variants)
    ? product.variants
    : [];
  const variants = sourceVariants
    .map((variant, variantIndex) => {
      const id = Number(variant?.id);
      if (!Number.isSafeInteger(id)) return null;
      const values = Array.isArray(variant.values)
        ? variant.values.map(localized).filter(Boolean).join(" / ")
        : "";
      const price = Number(variant?.promotional_price || variant?.price || 0);
      return {
        id,
        label:
          values ||
          variant.sku ||
          (sourceVariants.length === 1
            ? "Padrão"
            : `Opção ${variantIndex + 1}`),
        price: Number.isFinite(price) ? price : 0,
      };
    })
    .filter(Boolean);
  const firstVariant = variants[0];
  const productId = Number(product.id);
  if (!Number.isSafeInteger(productId) || !firstVariant) return null;

  const category = Array.isArray(product.categories)
    ? localized(product.categories[0]?.name)
    : "";
  const imageUrl =
    Array.isArray(product.images) && typeof product.images[0]?.src === "string"
      ? product.images[0].src
      : undefined;
  const name = localized(product.name) || `Produto ${index + 1}`;
  const slug = localized(product.handle) || `produto-${productId}`;

  return {
    id: productId,
    slug,
    name,
    price: firstVariant.price,
    category: category || "Adesivos",
    format: "Personalizado",
    material: "Consulte as opções",
    badge: index < 2 ? "MAIS VENDIDO" : "PERSONALIZÁVEL",
    imageUrl,
    description:
      plainText(product.description) ||
      "Produto Stick Adesivos disponível para personalização.",
    nuvemshopProductId: productId,
    nuvemshopVariantId: firstVariant.id,
    nuvemshopVariants: variants,
  };
}

export async function loadNuvemshopProducts() {
  const storeId = process.env.NUVEMSHOP_STORE_ID;
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN;
  if (!storeId || !token) {
    return {
      status: 503,
      body: {
        error: "Nuvemshop não configurada. O app usa os produtos locais.",
      },
    };
  }

  try {
    const response = await fetch(
      `https://api.nuvemshop.com.br/2025-03/${encodeURIComponent(storeId)}/products?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent":
            process.env.NUVEMSHOP_USER_AGENT ||
            "StickAdesivosApp (contato@stickadesivos.com.br)",
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      return {
        status: 502,
        body: { error: "Não foi possível carregar o catálogo da Nuvemshop." },
      };
    }
    const data = await response.json();
    const products = Array.isArray(data)
      ? data.map(publicProduct).filter(Boolean)
      : [];
    return { status: 200, body: { products } };
  } catch {
    return {
      status: 502,
      body: { error: "Não foi possível carregar o catálogo da Nuvemshop." },
    };
  }
}
