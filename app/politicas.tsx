import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import {
  ClosingCTA,
  Dado,
  InfoCard,
  PageIntro,
  Paragraph
} from '../src/components/PageBlocks';
import { colors, layout, spacing } from '../src/theme';

/*
 * Políticas da loja.
 *
 * Os pontos marcados como "a confirmar" dependem de dados
 * oficiais da empresa (razão social, CNPJ, prazos). Preencher
 * antes de publicar; nada aqui foi inventado.
 */

function AConfirmar({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.confirmar}>
      <Text style={styles.confirmarTitulo}>A confirmar</Text>
      <Text style={styles.confirmarTexto}>{children}</Text>
    </View>
  );
}

export default function PoliciesScreen() {
  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro
          eyebrow="Políticas da loja"
          title="Privacidade, trocas, entrega e termos de uso"
          lead="As regras da loja em linguagem simples. Os pontos marcados como a confirmar precisam ser preenchidos com os dados oficiais da empresa antes da publicação."
        />

        <InfoCard title="Privacidade">
          <Paragraph>
            Coletamos apenas os dados necessários para atender e entregar o pedido: nome, contato,
            endereço de entrega e os arquivos de arte enviados por você.
          </Paragraph>
          <Paragraph>
            Esses dados são usados para responder ao orçamento, produzir o pedido, emitir documento
            fiscal quando solicitado e combinar a entrega. Não vendemos dados para terceiros.
          </Paragraph>
          <Paragraph>
            A arte enviada é usada apenas para produzir o seu pedido. Para publicar uma foto do
            trabalho nas redes, pedimos autorização antes.
          </Paragraph>
          <Paragraph>
            O pagamento acontece no checkout da loja. Dados de cartão não passam por este
            aplicativo e não são armazenados por ele.
          </Paragraph>
          <AConfirmar>
            Razão social, CNPJ e e-mail oficial para pedidos relacionados a dados pessoais.
          </AConfirmar>
        </InfoCard>

        <InfoCard title="Trocas e devoluções">
          <Paragraph>
            Produtos personalizados são feitos sob medida a partir da arte aprovada por você, por
            isso não podem ser revendidos. A troca por arrependimento não se aplica a itens
            personalizados.
          </Paragraph>
          <Paragraph>
            Erro de produção é outra coisa: se o adesivo chegar com defeito de impressão, corte
            fora do combinado ou diferente da arte aprovada, a gente reimprime.
          </Paragraph>
          <Paragraph>
            Para solicitar, envie fotos do problema pelos canais de atendimento em até 7 dias
            corridos após o recebimento.
          </Paragraph>
          <Paragraph>
            Erros presentes na arte aprovada pelo cliente, como texto trocado ou telefone errado,
            não entram na reimpressão sem custo, já que a impressão seguiu o que foi aprovado.
          </Paragraph>
          <AConfirmar>Prazo oficial de reclamação e condições de reimpressão.</AConfirmar>
        </InfoCard>

        <InfoCard title="Prazos e entrega">
          <Paragraph>
            O prazo de produção é de <Dado campo="prazoProducao" />, contado a partir da aprovação
            da arte, e não inclui o tempo de transporte.
          </Paragraph>
          <Paragraph>
            Você pode retirar em Criciúma, no endereço <Dado campo="endereco" />, ou receber pelos
            Correios em todo o Brasil.
          </Paragraph>
          <Paragraph>
            O valor do frete é calculado pelo CEP na finalização do pedido. Assim que o pedido é
            postado, informamos o código de rastreio.
          </Paragraph>
          <AConfirmar>
            Existe entrega própria em Criciúma e região? Qual o prazo e o valor?
          </AConfirmar>
        </InfoCard>

        <InfoCard title="Termos de uso">
          <Paragraph>
            Ao pedir um orçamento ou fazer um pedido, você declara que tem direito de usar a arte
            enviada. A Stick Adesivos não se responsabiliza por uso indevido de marca, logo ou
            imagem de terceiros.
          </Paragraph>
          <Paragraph>
            Os valores e prazos informados no orçamento valem pelo período indicado na proposta.
            Alterações de arte, formato ou quantidade podem mudar o valor.
          </Paragraph>
          <Paragraph>
            As imagens são ilustrativas. Pequenas variações de cor podem ocorrer entre a tela e o
            material impresso, por causa da diferença entre cor de tela e cor de impressão.
          </Paragraph>
          <AConfirmar>Razão social, CNPJ e endereço completo da empresa.</AConfirmar>
        </InfoCard>

        <ClosingCTA
          title="Dúvida sobre alguma regra?"
          text="Pergunte antes de fechar o pedido. A gente explica sem enrolação."
          message="Olá! Tenho uma dúvida sobre as políticas da loja."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: '100%', maxWidth: layout.readingWidth, alignSelf: 'center', padding: spacing.md, paddingBottom: 48, gap: spacing.md },
  confirmar: {
    backgroundColor: '#FDF3D6',
    borderRadius: 7,
    padding: 11,
    gap: 3,
    marginTop: 4
  },
  confirmarTitulo: {
    color: '#7A5A00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  confirmarTexto: { color: '#6A5312', fontSize: 12, lineHeight: 18 }
});
