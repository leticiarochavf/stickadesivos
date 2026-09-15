import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import {
  Accordion,
  Bullets,
  ClosingCTA,
  Dado,
  InfoCard,
  PageIntro,
  Paragraph,
  SectionHeading
} from '../src/components/PageBlocks';
import { colors, spacing } from '../src/theme';

/*
 * Tela do segmento automotivo, com foco em número de arrancada.
 *
 * Importante: altura, cor e posição do número são definidas pelo
 * regulamento de cada prova. Nada aqui afirma medida oficial.
 */

const MENSAGEM_PADRAO = [
  'Olá! Quero orçamento de adesivo automotivo.',
  '- Tipo: (número de arrancada / patrocínio / faixa)',
  '- Carro: ',
  '- Cor do carro: ',
  '- Número e classe: ',
  '- Data da prova: '
].join('\n');

const servicos = [
  {
    titulo: 'Número de arrancada',
    texto:
      'O número da inscrição recortado em vinil, na altura que o regulamento da prova pedir, nas duas portas e no vidro.',
    itens: [
      'Recorte eletrônico, sem fundo, direto na lataria',
      'Contorno de segunda cor para destacar em carro escuro',
      'Jogo com número reserva, para troca no dia'
    ]
  },
  {
    titulo: 'Kit de patrocínio',
    texto:
      'Logos dos patrocinadores organizados nas áreas livres do carro, no mesmo padrão dos dois lados.',
    itens: [
      'Impresso quando o logo tem várias cores ou degradê',
      'Recortado quando é uma cor só',
      'Montagem mostrando onde cada logo vai ficar'
    ]
  },
  {
    titulo: 'Testeira e vidro',
    texto:
      'Faixa superior do parabrisa com o nome do piloto, da equipe ou do preparador, e adesivo de vidro traseiro.',
    itens: [
      'Nome do piloto, apelido e classe',
      'Tipo sanguíneo, quando a prova exigir',
      'Vinil que sai sem deixar cola no vidro'
    ]
  },
  {
    titulo: 'Faixas e detalhes de carroceria',
    texto: 'Faixa lateral, capô, teto, soleira e detalhe de para-lama, cortados na medida do carro.',
    itens: ['Faixa contínua ou dividida por painel', 'Repetição idêntica nos dois lados']
  }
];

export default function AutomotiveScreen() {
  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro
          eyebrow="Automotivo"
          title="Números de arrancada e adesivos para o seu carro."
          lead="Número de porta, número de vidro, testeira de parabrisa, kit de patrocínio e faixa de carroceria, recortados em vinil automotivo. Manda o número, a classe e a cor do carro que a gente monta o layout e envia para aprovação antes de cortar."
        />

        <SectionHeading text="O que a gente faz" highlight="para arrancada" />

        {servicos.map((servico) => (
          <InfoCard key={servico.titulo} title={servico.titulo}>
            <Paragraph>{servico.texto}</Paragraph>
            <Bullets items={servico.itens} />
          </InfoCard>
        ))}

        <View style={styles.aviso}>
          <Text style={styles.avisoTitulo}>Confirme antes de mandar cortar</Text>
          <Text style={styles.avisoTexto}>
            Altura mínima do número, cor obrigatória e posição mudam de organização para
            organização, e às vezes de uma prova para outra. Peça o regulamento a quem organiza
            e mande junto com o pedido. Assim o adesivo já sai dentro da exigência e você não
            corre risco na vistoria.
          </Text>
        </View>

        <InfoCard title="Onde costuma ir cada adesivo">
          <Bullets
            items={[
              'Número principal: porta, nos dois lados',
              'Número menor: vidro lateral traseiro',
              'Classe: perto do número principal',
              'Testeira: faixa superior do parabrisa, com o nome do piloto',
              'Patrocínio: para-lama, porta, capô e traseira'
            ]}
          />
          <Paragraph>
            As medidas seguem o regulamento da prova. A testeira e as faixas são cortadas na
            medida do seu carro.
          </Paragraph>
        </InfoCard>

        <InfoCard title="Material">
          <Paragraph>
            <Text style={styles.forte}>Recortado: </Text>o vinil é cortado no formato da letra ou
            do número e aplicado direto na lataria, sem fundo. Serve para número, classe, nome do
            piloto e logo de uma cor só.
          </Paragraph>
          <Paragraph>
            <Text style={styles.forte}>Impresso: </Text>a arte é impressa e recortada no contorno.
            Serve para logo com várias cores, degradê ou foto.
          </Paragraph>
          <Bullets
            items={[
              'Vinil para uso externo, que aguenta sol, chuva e lavagem',
              'Aplicação sobre pintura em bom estado, limpa e seca',
              'Sai sem deixar cola quando removido com cuidado, dentro do prazo do material',
              'Carro plotado ou envelopado: avise antes, a aplicação muda'
            ]}
          />
        </InfoCard>

        <InfoCard title="O que mandar no WhatsApp">
          <Bullets
            items={[
              'Número e classe da sua inscrição',
              'Foto do carro, de lado e de frente',
              'Cor do carro, para escolher o vinil que contrasta',
              'Regulamento da prova, se já tiver',
              'Logos dos patrocinadores em PDF, AI, CDR ou PNG',
              'Data da prova, para encaixar na produção'
            ]}
          />
          <Paragraph>
            Com isso a gente monta o layout sobre a foto do seu carro. Você aprova e só depois o
            vinil é cortado. Produção em <Dado campo="prazoProducao" />.
          </Paragraph>
        </InfoCard>

        <SectionHeading text="Dúvidas de" highlight="quem corre" />

        <Accordion question="Qual tamanho o número precisa ter?" startOpen>
          <Paragraph>
            Quem define é o regulamento da prova. Cada organização tem a sua exigência de altura,
            cor e posição.
          </Paragraph>
          <Paragraph>
            Mande o regulamento junto com o pedido. Se não tiver, a gente monta o layout e você
            confirma com a organização antes de aprovar.
          </Paragraph>
        </Accordion>

        <Accordion question="O adesivo estraga a pintura do carro?">
          <Paragraph>
            Em pintura original e em bom estado, o vinil sai sem levar tinta quando removido com
            cuidado e dentro do prazo de uso do material.
          </Paragraph>
          <Paragraph>
            Pintura antiga, repintura recente ou verniz descascando pedem atenção. Avise antes.
          </Paragraph>
        </Accordion>

        <Accordion question="Dá para trocar o número depois?">
          <Paragraph>
            Dá. O número é uma peça independente: remove a antiga e aplica a nova. Quem corre em
            mais de uma categoria costuma pedir um jogo reserva junto.
          </Paragraph>
        </Accordion>

        <Accordion question="Consigo para a prova deste fim de semana?">
          <Paragraph>
            Depende da fila de produção da semana. Chame no WhatsApp com a data da prova logo na
            primeira mensagem que a gente diz na hora se dá tempo.
          </Paragraph>
        </Accordion>

        <Accordion question="Não tenho arte nenhuma, só a ideia.">
          <Paragraph>
            Manda a foto do carro e conte o que você quer. A gente monta uma proposta em cima da
            foto para você ver antes de decidir.
          </Paragraph>
        </Accordion>

        <ClosingCTA
          title="Bora deixar o carro pronto para a pista?"
          text="Manda o número, a classe e uma foto do carro. A gente monta o layout e você aprova antes de qualquer corte."
          message={MENSAGEM_PADRAO}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.md, paddingBottom: 48, gap: spacing.md },
  aviso: {
    backgroundColor: '#FFF8E5',
    borderWidth: 1,
    borderColor: '#F2DCA5',
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow,
    borderRadius: 8,
    padding: spacing.md,
    gap: 5
  },
  avisoTitulo: { color: '#7A5A00', fontSize: 14, fontWeight: '900' },
  avisoTexto: { color: '#6A5312', fontSize: 13, lineHeight: 19 },
  forte: { color: colors.ink, fontWeight: '800' }
});
