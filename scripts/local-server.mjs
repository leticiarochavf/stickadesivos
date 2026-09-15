import { readFileSync } from 'node:fs';
import http from 'node:http';
import { resolve } from 'node:path';
import { lerCredenciaisApp, paginaResultado, trocarCodePorToken } from '../api/_oauth.mjs';

function loadLocalEnv() {
  try {
    const contents = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    contents.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!match || process.env[match[1]] !== undefined) return;
      const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
      process.env[match[1]] = value;
    });
  } catch {
    // O .env é opcional; em produção, use variáveis protegidas da hospedagem.
  }
}

loadLocalEnv();

const port = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.APP_ORIGINS || 'http://localhost:8081,http://localhost:19006')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function localized(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value.pt || value['pt-BR'] || value.es || value.en || Object.values(value).find((entry) => typeof entry === 'string') || '';
}

function plainText(value) {
  return localized(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}


/*
 * A loja publica alguns produtos com endereço gerado
 * automaticamente, do tipo "produto-teste-1-1b2dg", porque o
 * campo "URL do produto" está vazio no painel. Esse texto viraria
 * a URL da página no site. Enquanto o painel não for preenchido,
 * montamos um endereço a partir do nome.
 */
function enderecoLegivel(handle, name, productId) {
  const automatico = !handle || /^produto-teste|^produto-\d+$/i.test(handle);
  if (!automatico) return handle;

  const base = String(name || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `produto-${productId}`;
}

function publicProduct(product, index) {
  const sourceVariants = Array.isArray(product.variants) ? product.variants : [];
  const variants = sourceVariants.map((variant, variantIndex) => {
    const id = Number(variant?.id);
    if (!Number.isSafeInteger(id)) return null;
    const values = Array.isArray(variant.values)
      ? variant.values.map(localized).filter(Boolean).join(' / ')
      : '';
    const price = Number(variant?.promotional_price || variant?.price || 0);
    if (!Number.isFinite(price) || price <= 0) return null;

    return {
      id,
      label: values || variant.sku || (sourceVariants.length === 1 ? 'Padrão' : `Opção ${variantIndex + 1}`),
      price: Number.isFinite(price) ? price : 0
    };
  }).filter(Boolean);
  const variant = variants[0];
  const productId = Number(product.id);
  const variantId = variant?.id;
  if (!Number.isSafeInteger(productId) || !Number.isSafeInteger(variantId)) return null;

  const category = Array.isArray(product.categories) ? localized(product.categories[0]?.name) : '';
  const imageUrl = Array.isArray(product.images) && typeof product.images[0]?.src === 'string'
    ? product.images[0].src
    : undefined;
  const name = localized(product.name) || `Produto ${index + 1}`;
  const slug = enderecoLegivel(localized(product.handle), name, productId);
  const parsedPrice = variant?.price ?? 0;

  return {
    id: productId,
    slug,
    name,
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    category: category || 'Adesivos',
    format: 'Personalizado',
    material: 'Consulte as opções',
    badge: index < 2 ? 'MAIS VENDIDO' : 'PERSONALIZÁVEL',
    imageUrl,
    description: plainText(product.description) || 'Produto Stick Adesivos disponível para personalização.',
    nuvemshopProductId: productId,
    nuvemshopVariantId: variantId,
    nuvemshopVariants: variants
  };
}

function sendJSON(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJSON(res, 200, { ok: true, service: 'stick-adesivos-api' });
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const storeId = process.env.NUVEMSHOP_STORE_ID;
    const token = process.env.NUVEMSHOP_ACCESS_TOKEN;

    if (!storeId || !token) {
      return sendJSON(res, 503, { error: 'Nuvemshop não configurada. O app usa os produtos locais.' });
    }

    try {
      const response = await fetch(`https://api.nuvemshop.com.br/2025-03/${encodeURIComponent(storeId)}/products?per_page=100`, {
        headers: {
          // Cabeçalho da Nuvemshop: "Authentication", com "bearer"
          // minúsculo. "Authorization: Bearer" devolve 401.
          Authentication: `bearer ${token}`,
          'User-Agent': process.env.NUVEMSHOP_USER_AGENT || 'StickAdesivosApp (https://www.stickadesivos.com.br)',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) return sendJSON(res, 502, { error: 'Não foi possível carregar o catálogo da Nuvemshop.' });

      const data = await response.json();
      const products = Array.isArray(data) ? data.map(publicProduct).filter(Boolean) : [];
      return sendJSON(res, 200, { products });
    } catch {
      return sendJSON(res, 502, { error: 'Não foi possível carregar o catálogo da Nuvemshop.' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/oauth-callback') {
    const resultado = await trocarCodePorToken(url.searchParams.get('code'));
    const { ambienteLocal } = lerCredenciaisApp();
    res.writeHead(resultado.erro ? resultado.status : 200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    return res.end(paginaResultado(resultado, ambienteLocal));
  }

  return sendJSON(res, 404, { error: 'Rota não encontrada' });
});

server.listen(port, () => console.log(`Stick Adesivos API disponível na porta ${port}`));
