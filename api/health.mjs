export function GET() {
  /*
   * Resposta mínima, de propósito.
   *
   * Esta rota é pública. Durante a configuração ela mostrava quais
   * variáveis estavam preenchidas e o tamanho de cada uma, o que
   * ajudou a achar um token que não correspondia à loja. Isso não
   * deve ficar exposto num site publicado: mesmo sem revelar
   * valor, descreve como o servidor está configurado.
   *
   * Para diagnosticar de novo, rode o servidor local com
   * `npm run api` e confira o .env direto.
   */
  return Response.json({ ok: true, service: "stick-adesivos-api" });
}
