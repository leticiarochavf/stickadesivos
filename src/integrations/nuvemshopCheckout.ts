import { Linking, Platform } from 'react-native';
import type { CartItem } from '../context/CartContext';

/*
 * PAGAMENTO PELO CHECKOUT DA NUVEMSHOP
 * -------------------------------------------------------------
 * O cliente monta o carrinho aqui no site. Na hora de pagar, ele
 * vai para o checkout da loja, que já leva os itens dentro.
 *
 * Isso usa o link de carrinho da própria Nuvemshop:
 *
 *   https://LOJA/comprar/<variante>-<quantidade>
 *
 * e, para vários itens, separados por vírgula:
 *
 *   https://LOJA/comprar/<variante>-<qtd>,<variante>-<qtd>
 *
 * Não precisa de token, nem de aplicativo, nem de API. O
 * pagamento (Pix, boleto, cartão) acontece no Nuvem Pago, com as
 * condições que a loja já tem configuradas.
 *
 * Nenhum dado de cartão passa por este site.
 */

/*
 * Endereço da LOJA Nuvemshop — não é o endereço do site.
 *
 * Usamos o endereço que a Nuvemshop fornece, e não o domínio
 * próprio, de propósito: ele não depende de DNS e continua
 * valendo no dia em que stickadesivos.com.br passar a servir o
 * site (ver MIGRACAO-DOMINIO.md). Assim a virada de domínio não
 * derruba o botão de pagar.
 *
 * Se um dia existir loja.stickadesivos.com.br vinculado e com
 * SSL, basta trocar por ele: o cliente passa a ver a marca no
 * checkout. Subdomínio não tem custo.
 */
export const STORE_URL = 'https://stickadesivos.lojavirtualnuvem.com.br';

export type CheckoutResultado =
  | { ok: true; url: string }
  | { ok: false; motivo: 'carrinho-vazio' | 'sem-variante'; itemSemVariante?: string };

function varianteDoItem(item: CartItem): number | null {
  const id = item.nuvemshopVariantId || item.product?.nuvemshopVariantId;
  return typeof id === 'number' && id > 0 ? id : null;
}

/*
 * Monta o endereço do carrinho da loja com todos os itens.
 * Devolve o motivo quando algum item não pode ser enviado, para a
 * tela avisar em vez de mandar um link quebrado.
 */
export function montarLinkDeCarrinho(items: CartItem[]): CheckoutResultado {
  if (!items.length) {
    return { ok: false, motivo: 'carrinho-vazio' };
  }

  const partes: string[] = [];

  for (const item of items) {
    const variante = varianteDoItem(item);

    if (!variante) {
      return {
        ok: false,
        motivo: 'sem-variante',
        itemSemVariante: item.product?.name || 'produto'
      };
    }

    const quantidade = Math.max(1, Math.round(Number(item.qty) || 1));
    partes.push(`${variante}-${quantidade}`);
  }

  return { ok: true, url: `${STORE_URL}/comprar/${partes.join(',')}` };
}

/*
 * Leva o cliente ao checkout da loja.
 * Na web abre na mesma aba, para a compra seguir sem popup
 * bloqueado; no aplicativo abre o navegador do sistema.
 */
export async function irParaCheckout(items: CartItem[]): Promise<CheckoutResultado> {
  const resultado = montarLinkDeCarrinho(items);

  if (!resultado.ok) {
    return resultado;
  }

  /*
   * Na web é preciso navegar na mesma aba.
   * Linking.openURL abre uma janela nova, e navegador costuma
   * bloquear janela nova aberta por código — o cliente clicaria
   * em pagar e nada aconteceria.
   */
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.href = resultado.url;
    return resultado;
  }

  try {
    await Linking.openURL(resultado.url);
  } catch {
    /* Se o sistema recusar a abertura, quem chamou mostra o
       endereço para a pessoa abrir na mão. */
  }

  return resultado;
}
