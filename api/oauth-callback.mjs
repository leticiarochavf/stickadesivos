import { lerCredenciaisApp, paginaResultado, trocarCodePorToken } from './_oauth.mjs';

/*
 * GET /api/oauth-callback?code=...
 *
 * Esta é a URL de redirecionamento que deve ser cadastrada no
 * Portal de Parceiros, em Configuração › Dados básicos › URLs do
 * aplicativo.
 *
 * Em produção:      https://SEU-DOMINIO/api/oauth-callback
 * Em desenvolvimento: http://localhost:3000/api/oauth-callback
 */

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const resultado = await trocarCodePorToken(code);
  const { ambienteLocal } = lerCredenciaisApp();

  return new Response(paginaResultado(resultado, ambienteLocal), {
    status: resultado.erro ? resultado.status : 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      /* Nunca guardar em cache: a página pode conter o token */
      'Cache-Control': 'no-store'
    }
  });
}
