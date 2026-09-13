# Stick Adesivos — Expo + Node

Conversão do protótipo HTML/CSS/JavaScript para um aplicativo mobile em Expo + TypeScript, com uma API Node preparada para a futura integração com a Nuvemshop.

## Telas migradas

- Início com hero, benefícios, produtos em destaque e fluxo de compra
- Catálogo com busca, categorias, materiais e ordenação
- Detalhe do produto com tamanho, quantidade, upload da arte e CEP
- Carrinho persistido no aparelho
- Checkout demonstrativo
- Contato
- Sobre a Stick Adesivos

## Como executar o aplicativo

```bash
npm install
npm run dev
```

Depois, escaneie o QR Code com o Expo Go ou pressione `a` para Android, `i` para iOS ou `w` para web.

## Como executar a API Node

Em outro terminal:

```bash
npm run api
```

Por padrão, a API fica em `http://localhost:3000`. A rota `/api/health` funciona sem configuração. A rota `/api/products` consulta a Nuvemshop apenas quando as variáveis do `.env` estiverem preenchidas.

O token da Nuvemshop deve ficar somente no servidor Node, nunca dentro do aplicativo Expo.
