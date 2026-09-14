/*
 * TROCA DO CODE PELO ACCESS TOKEN DA NUVEMSHOP
 * -------------------------------------------------------------
 * Fluxo completo:
 *
 * 1. O lojista abre:
 *      https://www.nuvemshop.com.br/apps/42138/authorize
 * 2. Autoriza o app e é devolvido para a URL de redirecionamento
 *    cadastrada no Portal de Parceiros, com ?code=... na URL.
 * 3. Esta função troca esse code por um access_token.
 *
 * O access_token não expira, mas deixa de valer se o app for
 * reinstalado ou desinstalado.
 *
 * SEGURANÇA
 * O token e o client_secret nunca podem aparecer numa página
 * pública. Em produção este módulo só registra o token no log do
 * servidor; na máquina do desenvolvedor ele também mostra na
 * tela, para facilitar o primeiro cadastro.
 */

const TOKEN_URL = 'https://www.tiendanube.com/apps/authorize/token';

export function lerCredenciaisApp() {
  return {
    clientId: process.env.NUVEMSHOP_CLIENT_ID,
    clientSecret: process.env.NUVEMSHOP_CLIENT_SECRET,
    /* Em desenvolvimento local mostramos o token na tela.
       Qualquer outro ambiente só registra no log. */
    ambienteLocal:
      process.env.NODE_ENV !== 'production' && !process.env.VERCEL
  };
}

export async function trocarCodePorToken(code) {
  const { clientId, clientSecret } = lerCredenciaisApp();

  if (!clientId || !clientSecret) {
    return {
      status: 503,
      erro:
        'Faltam NUVEMSHOP_CLIENT_ID e NUVEMSHOP_CLIENT_SECRET. Pegue os dois no Portal de Parceiros, em Chaves de acesso.'
    };
  }

  if (!code) {
    return {
      status: 400,
      erro: 'A URL não trouxe o parâmetro "code". Refaça a autorização a partir do Portal de Parceiros.'
    };
  }

  let resposta;

  try {
    resposta = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code
      })
    });
  } catch (erro) {
    console.error('[nuvemshop] falha de rede na troca do code:', erro);
    return { status: 502, erro: 'Não foi possível falar com a Nuvemshop.' };
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok || !dados?.access_token) {
    console.error(
      `[nuvemshop] troca do code falhou: HTTP ${resposta.status}`,
      JSON.stringify(dados)?.slice(0, 300)
    );
    return {
      status: 502,
      erro:
        'A Nuvemshop recusou a troca. Confira o client_secret e se o code ainda é válido; ele vale uma vez só.'
    };
  }

  /* O log do servidor é o canal seguro: aparece no terminal em
     desenvolvimento e nos logs da hospedagem em produção. */
  console.log('[nuvemshop] autorização concluída. Guarde nas variáveis de ambiente:');
  console.log(`NUVEMSHOP_STORE_ID=${dados.user_id}`);
  console.log(`NUVEMSHOP_ACCESS_TOKEN=${dados.access_token}`);

  return {
    status: 200,
    storeId: dados.user_id,
    accessToken: dados.access_token,
    scope: dados.scope
  };
}

/* Página simples de retorno, sem depender do app React */
export function paginaResultado(resultado, mostrarToken) {
  const base = (titulo, corpo, cor) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stick Adesivos · autorização</title>
<style>
 body{margin:0;background:#F8F9FB;color:#1D2028;font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif;
      display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
 .cartao{background:#fff;border:1px solid #E6E9EF;border-radius:12px;padding:28px;max-width:560px;width:100%}
 h1{margin:0 0 12px;font-size:22px;color:${cor}}
 p{margin:0 0 12px;color:#414957;font-size:15px}
 code{display:block;background:#12161C;color:#DCE3ED;border-radius:8px;padding:14px;
      font-family:ui-monospace,Consolas,monospace;font-size:13px;white-space:pre-wrap;word-break:break-all}
 .aviso{background:#FDF3D6;color:#6A5312;border-radius:8px;padding:12px;font-size:13px}
</style></head><body><div class="cartao"><h1>${titulo}</h1>${corpo}</div></body></html>`;

  if (resultado.erro) {
    return base(
      'Não deu certo',
      `<p>${resultado.erro}</p><p>Nada foi salvo. Você pode tentar a autorização de novo.</p>`,
      '#A01035'
    );
  }

  const segredo = mostrarToken
    ? `<p>Copie as duas linhas abaixo para o seu arquivo <b>.env</b>:</p>
       <code>NUVEMSHOP_STORE_ID=${resultado.storeId}
NUVEMSHOP_ACCESS_TOKEN=${resultado.accessToken}</code>
       <p class="aviso">Este token dá acesso à loja. Não coloque em repositório, não mande por mensagem e não deixe em arquivo do aplicativo.</p>`
    : `<p>A loja autorizada é a <b>${resultado.storeId}</b>.</p>
       <p class="aviso">Por segurança, o token não é exibido nesta página. Ele está no log do servidor: pegue lá e cadastre em NUVEMSHOP_ACCESS_TOKEN.</p>`;

  return base('Autorização concluída', segredo, '#137A45');
}
