import { loadNuvemshopProducts } from "./_catalog.mjs";

export async function GET() {
  const result = await loadNuvemshopProducts();
  return Response.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control":
        result.status === 200
          ? "s-maxage=300, stale-while-revalidate=600"
          : "no-store",
    },
  });
}
