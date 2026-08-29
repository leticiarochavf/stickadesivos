
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'};

const server = http.createServer(async (req,res)=>{
  const url = new URL(req.url, `http://${req.headers.host}`);
  if(url.pathname === '/api/products'){
    const storeId=process.env.NUVEMSHOP_STORE_ID, token=process.env.NUVEMSHOP_ACCESS_TOKEN;
    if(!storeId || !token){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Nuvemshop não configurada'}));}
    try{
      const r=await fetch(`https://api.nuvemshop.com.br/v1/${storeId}/products?per_page=100`,{headers:{Authorization:`Bearer ${token}`,'User-Agent':process.env.NUVEMSHOP_USER_AGENT||'StickAdesivosHeadless (local@dev)'}});
      res.writeHead(r.status,{'Content-Type':'application/json'});return res.end(await r.text());
    }catch(e){res.writeHead(500,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:String(e)}));}
  }
  let rel=decodeURIComponent(url.pathname); if(rel==='/'||rel==='')rel='/index.html';
  const file=path.normalize(path.join(__dirname,rel));
  if(!file.startsWith(__dirname)){res.writeHead(403);return res.end('Forbidden');}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)});
});
server.listen(port,()=>console.log(`Stick Adesivos em http://localhost:${port}`));
