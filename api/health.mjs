export function GET() {
  /*
   * Diagnóstico da configuração, sem revelar segredo nenhum:
   * mostra apenas se cada variável existe e o tamanho dela.
   * Serve para descobrir token colado pela metade ou store_id
   * que não corresponde ao token.
   */
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN || "";
  const secret = process.env.NUVEMSHOP_CLIENT_SECRET || "";

  return Response.json({
    ok: true,
    service: "stick-adesivos-api",
    config: {
      store_id: process.env.NUVEMSHOP_STORE_ID || null,
      client_id: process.env.NUVEMSHOP_CLIENT_ID || null,
      user_agent: process.env.NUVEMSHOP_USER_AGENT || null,
      access_token_tamanho: token.length,
      access_token_tem_espaco: /\s/.test(token),
      client_secret_tamanho: secret.length
    }
  });
}
