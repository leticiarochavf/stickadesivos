# Ponte NubeSDK — Stick Adesivos

Script TypeScript responsável por incorporar o frontend da Stick Adesivos e encaminhar operações de carrinho ao storefront oficial da Nuvemshop.

## Comandos

```bash
npm install
npm run lint
npm test
npm run build
```

O build gera `dist/main.min.js`. Publique esse arquivo em uma URL HTTPS e cadastre a URL na aplicação da Nuvemshop com o parâmetro `frontend_url` apontando para o frontend web também publicado em HTTPS.

Exemplo de formato, sem chaves ou segredos:

```text
https://scripts.seudominio.com.br/main.min.js?frontend_url=https%3A%2F%2Fapp.seudominio.com.br
```

A ponte aceita apenas mensagens identificadas da Stick Adesivos e valida IDs e quantidades antes de alterar o carrinho.
