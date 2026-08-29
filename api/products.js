
const MOCK = null;
export default async function handler(req, res) {
  const storeId = process.env.NUVEMSHOP_STORE_ID;
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN;
  const userAgent = process.env.NUVEMSHOP_USER_AGENT || 'StickAdesivosHeadless (contato@exemplo.com)';
  if (!storeId || !token) {
    return res.status(503).json({ error: 'Nuvemshop não configurada. O front-end usa os mocks locais.' });
  }
  try {
    const response = await fetch(`https://api.nuvemshop.com.br/v1/${storeId}/products?per_page=100`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': userAgent, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao consultar Nuvemshop', detail: String(error) });
  }
}
