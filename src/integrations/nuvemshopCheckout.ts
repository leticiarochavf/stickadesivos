import { Linking } from 'react-native';
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
 * Endereço da loja Nuvemshop.
 *
 * ATENÇÃO: este é o endereço da LOJA, não o do site. Se um dia o
 * site passar a usar www.stickadesivos.com.br, a loja precisará
 * de outro endereço (por exemplo loja.stickadesivos.com.br) e
 * este valor tem que ser atualizado junto.
 */
export const STORE_URL = 'https://www.stickadesivos.com.br';

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

  try {
    await Linking.openURL(resultado.url);
  } catch {
    /* Se o sistema recusar a abertura, quem chamou mostra o
       endereço para a pessoa abrir na mão. */
  }

  return resultado;
}
