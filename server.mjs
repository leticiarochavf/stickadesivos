import http from 'node:http';

const port = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (url.pathname === '/api/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true, service: 'stick-adesivos-api' }));
  }

  if (url.pathname === '/api/products') {
    const storeId = process.env.NUVEMSHOP_STORE_ID;
    const token = process.env.NUVEMSHOP_ACCESS_TOKEN;

    if (!storeId || !token) {
      res.writeHead(503);
      return res.end(JSON.stringify({ error: 'Nuvemshop não configurada. O app usa os produtos locais.' }));
    }

    try {
      const response = await fetch(`https://api.nuvemshop.com.br/v1/${storeId}/products?per_page=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': process.env.NUVEMSHOP_USER_AGENT || 'StickAdesivosApp (local@dev)',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.text();
      res.writeHead(response.status);
      return res.end(data);
    } catch (error) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: 'Falha ao consultar a Nuvemshop', detail: String(error) }));
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

server.listen(port, () => console.log(`Stick Adesivos API em http://localhost:${port}`));
