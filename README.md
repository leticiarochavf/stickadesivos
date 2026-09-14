# Stick Adesivos — Expo + Nuvemshop

Frontend da Stick Adesivos em Expo/React Native Web e TypeScript, mantendo o visual original e usando o checkout nativo da Nuvemshop para entrega e pagamento.

## Arquitetura do pagamento

O projeto não recebe nem armazena dados de cartão. O frontend envia os produtos ao carrinho da Nuvemshop por uma integração NubeSDK; em seguida, a pessoa conclui a compra no checkout oficial, com as opções habilitadas no Nuvem Pago.

- `app/` e `src/`: experiência visual existente em Expo/TypeScript.
- `scripts/local-server.mjs`: consulta os produtos reais no desenvolvimento local sem expor o token no navegador.
- `nuvemshop-storefront/`: script NubeSDK que conecta o frontend ao carrinho nativo.

## Desenvolvimento local

Copie `.env.example` para `.env`, preencha apenas no seu computador e execute:

```bash
npm install
npm run api
```

Em outro terminal:

```bash
npm run web
```

A rota `/api/health` funciona sem credenciais. Enquanto a Nuvemshop não estiver configurada, o aplicativo mantém os produtos visuais locais e bloqueia apenas a ida ao pagamento para evitar um pedido inconsistente.

## Ponte do carrinho Nuvemshop

```bash
cd nuvemshop-storefront
npm install
npm run test
npm run build
```

O arquivo gerado em `nuvemshop-storefront/dist/main.min.js` deve ser enviado pelo Portal de Parceiros como script NubeSDK, validado primeiro em uma loja demo e então ativado. Por padrão, ele incorpora a versão web publicada deste projeto; o parâmetro opcional `frontend_url=https://...` permite trocar a URL em uma instalação de teste.

Na hospedagem do frontend, configure todas as rotas (`/produto/...`, `/carrinho`, `/checkout`) para retornarem `index.html`, pois a navegação web funciona como uma aplicação de página única.

O token da Nuvemshop fica somente no servidor. Nunca inclua `.env`, tokens ou segredos no aplicativo, no repositório ou no endereço do script.

> A seleção da arte ainda é local e não envia o arquivo. Antes da venda de personalizados em produção, conecte esse campo a um armazenamento privado e registre no pedido apenas uma referência segura ao arquivo.

## Hospedagem na Vercel

A Vercel hospeda o frontend, as funções de API e o script NubeSDK. O domínio principal não deve ser apontado para a Vercel: ele continua na Nuvemshop, e o frontend hospedado é incorporado pela ponte. Assim, o endereço visto pelo cliente permanece `www.stickadesivos.com.br`.

O comando de produção é:

```bash
npm run build:vercel
```

Na Vercel, configure `NUVEMSHOP_STORE_ID`, `NUVEMSHOP_ACCESS_TOKEN` e `NUVEMSHOP_USER_AGENT` como variáveis protegidas. O token nunca deve usar o prefixo público `EXPO_PUBLIC_`.

