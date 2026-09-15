import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import {
  Accordion,
  ClosingCTA,
  Dado,
  PageIntro,
  Paragraph
} from '../src/components/PageBlocks';
import { colors, layout, spacing } from '../src/theme';

/*
 * Dúvidas frequentes.
 * Prazo e quantidade mínima vêm da configuração central: enquanto
 * não forem preenchidos, aparecem como "a confirmar" em vez de um
 * número inventado.
 */

export default function FaqScreen() {
  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro
          eyebrow="Dúvidas"
          title="Perguntas frequentes sobre adesivos personalizados"
          lead="As dúvidas que mais aparecem no atendimento, respondidas de forma direta. Se a sua não estiver aqui, chame no WhatsApp."
        />

        <Accordion question="Qual é a quantidade mínima de adesivos?" startOpen>
          <Paragraph>
            O pedido mínimo é de <Dado campo="pedidoMinimo" />. Para quantidades menores, fale com
            a gente que verificamos a possibilidade.
          </Paragraph>
        </Accordion>

        <Accordion question="Quanto tempo leva para ficar pronto?">
          <Paragraph>
            A produção leva <Dado campo="prazoProducao" />, contados a partir da aprovação da arte.
          </Paragraph>
          <Paragraph>
            O prazo total depende ainda da entrega: retirada em Criciúma é imediata assim que o
            pedido fica pronto, e o envio segue o prazo dos Correios.
          </Paragraph>
        </Accordion>

        <Accordion question="Consigo ver como vai ficar antes de imprimir?">
          <Paragraph>
            Sim. Enviamos o modelo do adesivo para você conferir tamanho, cor e posição dos
            elementos. A impressão só começa depois da sua aprovação.
          </Paragraph>
        </Accordion>

        <Accordion question="Não tenho a arte pronta. Vocês criam?">
          <Paragraph>
            Conte pelo WhatsApp o que precisa aparecer no adesivo e envie o que já tiver, como logo
            ou foto. A gente avalia o caso e informa como funciona a criação da arte e se há custo.
          </Paragraph>
        </Accordion>

        <Accordion question="Em que formato devo enviar o arquivo?">
          <Paragraph>
            Aceitamos PDF, AI, CDR, PNG e JPG. Arquivos vetoriais, como PDF e AI, mantêm a
            qualidade em qualquer tamanho.
          </Paragraph>
          <Paragraph>
            Se for imagem, envie na maior resolução que tiver, para o adesivo não sair borrado.
          </Paragraph>
        </Accordion>

        <Accordion question="Qual material é melhor para o meu produto?">
          <Paragraph>
            Depende de onde o adesivo vai colar. Vinil atende a maioria das embalagens, e o Void é
            o material do lacre de segurança.
          </Paragraph>
          <Paragraph>
            Mande uma foto da embalagem que a gente indica o material e o tamanho.
          </Paragraph>
        </Accordion>

        <Accordion question="O adesivo resiste a água, geladeira ou sol?">
          <Paragraph>
            A resistência muda conforme o material. Diga onde o adesivo vai ser usado no momento do
            orçamento para a indicação vir certa.
          </Paragraph>
        </Accordion>

        <Accordion question="Vocês entregam em Criciúma e região?">
          <Paragraph>
            Sim. Você pode retirar em Criciúma ou receber no endereço informado. Também enviamos
            para todo o Brasil pelos Correios.
          </Paragraph>
        </Accordion>

        <Accordion question="Como posso pagar?">
          <Paragraph>
            O pagamento é feito no checkout da loja, com Pix, boleto ou cartão de crédito. As
            condições de parcelamento aparecem na finalização do pedido.
          </Paragraph>
        </Accordion>

        <Accordion question="Emitem nota fiscal?">
          <Paragraph>
            Informe no pedido que você precisa de nota fiscal e passe os dados da empresa.
            Confirmamos no atendimento antes de fechar o orçamento.
          </Paragraph>
        </Accordion>

        <Accordion question="E se o adesivo chegar com defeito?">
          <Paragraph>
            Fale com a gente assim que receber, com fotos do problema. Erro de produção é resolvido
            por reimpressão, conforme a política de trocas.
          </Paragraph>
        </Accordion>

        <Accordion question="Posso pedir uma amostra antes do pedido grande?">
          <Paragraph>
            Fale com a gente pelo WhatsApp explicando o projeto. Avaliamos caso a caso a melhor
            forma de você ver o resultado antes de fechar uma tiragem maior.
          </Paragraph>
        </Accordion>

        <Text style={styles.nota}>
          Regras completas de privacidade, trocas, entrega e uso ficam na tela de políticas.
        </Text>

        <ClosingCTA
          title="Ficou alguma dúvida?"
          text="Chame no WhatsApp. A gente responde com a informação do seu caso, não com resposta pronta."
          message="Olá! Li as dúvidas frequentes e fiquei com uma pergunta."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: '100%', maxWidth: layout.readingWidth, alignSelf: 'center', padding: spacing.md, paddingBottom: 48 },
  nota: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 }
});
