import { Linking } from 'react-native';

/*
 * CONFIGURAÇÃO CENTRAL DA STICK ADESIVOS
 * -------------------------------------------------------------
 * Este é o único arquivo a editar para colocar os dados reais no
 * ar. Tudo que estiver vazio aparece no app como "a confirmar",
 * em vez de um espaço em branco ou de uma informação inventada.
 *
 * Nada aqui é segredo: este arquivo vai para o navegador. Token
 * da Nuvemshop nunca entra aqui — ele fica só no servidor, em
 * variáveis de ambiente.
 */

export const storeConfig = {
  /* Número com código do país e DDD, só dígitos.
     Exemplo de formato: '5548999999999'
     PREENCHER: enquanto estiver vazio, os botões de WhatsApp
     levam para a tela de contato. */
  whatsapp: '',

  /* PREENCHER. Exemplo: '(48) 99999-9999' */
  telefone: '',

  /* PREENCHER. Exemplo: 'Rua Exemplo, 123 — Centro, Criciúma/SC' */
  endereco: '',

  /* PREENCHER. Exemplo: 'Segunda a sexta, 8h às 18h' */
  horario: '',

  /* PREENCHER. Exemplo: 'até 5 dias úteis' */
  prazoProducao: '',

  /* PREENCHER. Exemplo: '50 unidades' */
  pedidoMinimo: '',

  /* PREENCHER. Exemplo: 'contato@stickadesivos.com.br' */
  email: '',

  /* Dados fixos da marca */
  cidade: 'Criciúma',
  estado: 'SC',
  instagram: 'stickadesivos',
  site: 'https://www.stickadesivos.com.br'
};

/*
 * Texto que aparece no lugar de um dado que ainda não foi
 * preenchido. Use com o componente <Dado /> ou com valorOu().
 */
const pendentes: Record<string, string> = {
  telefone: 'telefone a confirmar',
  endereco: 'endereço a confirmar',
  horario: 'horário a confirmar',
  prazoProducao: 'prazo a confirmar',
  pedidoMinimo: 'quantidade mínima a confirmar',
  email: 'e-mail a confirmar'
};

export type CampoConfig = keyof typeof pendentes;

export function valorOu(campo: CampoConfig): string {
  const valor = (storeConfig as Record<string, string>)[campo];
  return valor || pendentes[campo];
}

export function dadoPendente(campo: CampoConfig): boolean {
  return !(storeConfig as Record<string, string>)[campo];
}

/*
 * Monta o endereço do WhatsApp já com a mensagem escrita.
 * Devolve null quando o número ainda não foi cadastrado, para a
 * tela poder mandar a pessoa para o contato em vez de abrir um
 * link quebrado.
 */
export function whatsappURL(mensagem: string): string | null {
  if (!storeConfig.whatsapp) return null;
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/*
 * Abre o WhatsApp. Devolve false quando não está configurado,
 * para quem chamou decidir o que fazer (normalmente ir para a
 * tela de contato).
 */
export async function abrirWhatsApp(mensagem: string): Promise<boolean> {
  const url = whatsappURL(mensagem);
  if (!url) return false;

  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
