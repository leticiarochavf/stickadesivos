# Levar o site para stickadesivos.com.br

Guia para o domínio do cliente passar a servir o site em Expo, mantendo a loja Nuvemshop como checkout.

---

## O que muda

| | Hoje | Depois |
|---|---|---|
| `stickadesivos.com.br` | loja Nuvemshop | **site em Expo** |
| `www.stickadesivos.com.br` | loja Nuvemshop | site em Expo |
| `loja.stickadesivos.com.br` | não existe | **loja Nuvemshop, onde o cliente paga** |
| `stickadesivos.vercel.app` | site | continua funcionando |

A loja não sai do ar em momento algum se a ordem abaixo for respeitada. Ela só muda de endereço.

## Por que assim

O site é onde está o conteúdo que atrai busca: automotivo e arrancada, serviços, dúvidas, orçamento, texto local de Criciúma. Esse conteúdo rende muito mais no domínio principal do que a loja, cujo SEO hoje está vazio — os produtos estão publicados com endereços como `produtos/produto-teste-1-1b2dg`, e os campos de título e descrição estão em branco.

O checkout continua sendo o da Nuvemshop, em um endereço da mesma marca. O cliente vê `loja.stickadesivos.com.br` na hora de pagar, com o mesmo cadeado e o mesmo Nuvem Pago.

## Onde mexer

O domínio está registrado no **Registro.br** e usa o DNS de lá (`d.sec.dns.br` e `f.sec.dns.br`). Não depende da Nuvemshop para ser apontado.

---

## Ordem, sem deixar a loja fora do ar

### 1. Criar o subdomínio da loja

No Registro.br, em *Editar Zona DNS*:

```
Tipo    Nome    Valor
CNAME   loja    stickadesivos.lojavirtualnuvem.com.br
```

### 2. Cadastrar o subdomínio na Nuvemshop

No painel da loja: **Configurações › Domínios**, adicionar `loja.stickadesivos.com.br`. Confirmar o e-mail de verificação, se a Nuvemshop pedir.

Aguardar a propagação. Pode levar algumas horas.

### 3. Conferir que a loja responde nos dois endereços

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://loja.stickadesivos.com.br
curl -s -o /dev/null -w "%{http_code}\n" "https://loja.stickadesivos.com.br/comprar/1585367392-1"
```

Os dois precisam responder 200 **antes** de seguir. Se não responderem, pare aqui: nada foi alterado ainda.

### 4. Apontar o site para o novo endereço da loja

Em `src/integrations/nuvemshopCheckout.ts`, trocar:

```ts
export const STORE_URL = 'https://www.stickadesivos.com.br';
```

por:

```ts
export const STORE_URL = 'https://loja.stickadesivos.com.br';
```

Commit e push. O deploy sai sozinho.

> Este passo tem que vir **antes** do passo 5. Depois que o `www` apontar para a Vercel, o endereço antigo de carrinho deixa de existir, e o botão de pagar quebraria.

### 4.1 Trocar o domínio Principal da loja

No painel da loja, em **Configurações › Domínios**, o domínio marcado como **Principal** hoje é `stickadesivos.com.br`. Por causa disso a Nuvemshop redireciona qualquer acesso da loja para ele — inclusive o endereço de carrinho.

Antes de mexer no DNS, marcar como Principal o `loja.stickadesivos.com.br` (ou, se ele ainda não estiver vinculado, o `stickadesivos.lojavirtualnuvem.com.br`).

> Se isso não for feito, no dia da virada a loja vai redirecionar o checkout para `stickadesivos.com.br`, que a essa altura já será o site — e o cliente cai no site em vez de pagar.

### 5. Apontar o domínio para a Vercel

No Registro.br, trocar os apontamentos atuais:

```
Tipo    Nome    Valor            (remover: A @ 185.133.35.21 e 185.133.35.22)
A       @       216.198.79.1

Tipo    Nome    Valor            (remover: CNAME www stickadesivos.lojavirtualnuvem.com.br)
CNAME   www     7256bf42fe74c600.vercel-dns-017.com.
```

Os domínios já estão cadastrados no projeto da Vercel. Assim que o DNS propagar, o status sai de *Invalid Configuration* para *Valid Configuration* e o certificado é emitido automaticamente.

### 6. Conferir o conjunto

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://stickadesivos.com.br
curl -s -o /dev/null -w "%{http_code}\n" https://www.stickadesivos.com.br/automotivo
curl -s -o /dev/null -w "%{http_code}\n" https://loja.stickadesivos.com.br
```

E, no site, adicionar um produto ao carrinho e clicar em finalizar: tem que cair no checkout em `loja.stickadesivos.com.br`.

---

## O que observar depois

**Endereços antigos da loja.** Quem tiver salvo `stickadesivos.com.br/produtos/...` vai cair no site novo. Como esses endereços são os `produto-teste-*` gerados automaticamente, a perda é pequena. Se aparecer tráfego neles, dá para criar redirecionamentos.

**Google.** O endereço da loja muda, então o índice leva algum tempo para acompanhar. Vale atualizar o Perfil da Empresa no Google e o link da bio do Instagram para o domínio principal.

**E-mail.** Se existir e-mail no domínio, os registros MX **não podem ser removidos** ao mexer na zona. Só os registros A e CNAME acima mudam.

---

## Se preferir o contrário

Dá para manter a loja no domínio principal e publicar o site em `catalogo.stickadesivos.com.br`. É menos trabalho e nada muda para quem já compra, mas o conteúdo do site deixa de somar para o domínio principal.
