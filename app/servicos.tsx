import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import {
  Bullets,
  ClosingCTA,
  GhostButton,
  InfoCard,
  PageIntro,
  Paragraph,
  SectionHeading
} from '../src/components/PageBlocks';
import { colors, spacing } from '../src/theme';

/*
 * Tela de serviços: o que a Stick faz, em linguagem de quem
 * nunca pediu adesivo antes.
 */

type Servico = {
  titulo: string;
  paraQuem: string;
  descricao: string;
  beneficio: string;
  usos: string[];
  enviar: string;
  mensagem: string;
};

const servicos: Servico[] = [
  {
    titulo: 'Adesivos personalizados',
    paraQuem: 'Para quem já tem uma marca ou uma ideia pronta',
    descricao:
      'Sua arte impressa no formato, no tamanho e no material que combinam com o produto. Redondo, quadrado ou recortado no contorno do desenho.',
    beneficio:
      'Um adesivo que deixa o produto reconhecível e pronto para vender, sem improviso na embalagem.',
    usos: [
      'Fechar embalagem e marcar brinde',
      'Identificar produto artesanal',
      'Decorar caixa de envio, pote e sacola'
    ],
    enviar:
      'Arquivo da arte (PDF, AI, CDR, PNG ou JPG), formato e tamanho em centímetros, quantidade e prazo. Sem arte, descreva o que precisa aparecer.',
    mensagem: 'Olá! Quero orçamento de adesivos personalizados.'
  },
  {
    titulo: 'Etiquetas para embalagem',
    paraQuem: 'Para quem vende comida, cosmético, artesanato ou produto embalado',
    descricao:
      'Rótulo com nome do produto, ingredientes, validade, modo de usar ou contato, no tamanho certo do pote, da caixa ou da sacola.',
    beneficio:
      'Uma embalagem que passa a informação certa e parece profissional na prateleira e na foto.',
    usos: [
      'Rótulo de pote de doce e etiqueta de cosmético',
      'Selo de validade e lacre de caixa',
      'Identificação de kit e cesta'
    ],
    enviar:
      'Medida da embalagem, textos que precisam aparecer, quantidade, e se o produto vai para geladeira, freezer ou contato com óleo.',
    mensagem: 'Olá! Quero orçamento de etiquetas para embalagem.'
  },
  {
    titulo: 'Divulgação, organização e eventos',
    paraQuem: 'Para lojas, escritórios, prestadores de serviço e festas',
    descricao:
      'Adesivo de vitrine com redes sociais e QR Code, identificação de caixas e prateleiras, numeração de patrimônio e lembrança de evento.',
    beneficio:
      'Informação visível no lugar certo, para o cliente achar seu perfil ou a equipe achar o que está guardado.',
    usos: [
      'Vitrine, balcão, porta e veículo',
      'Caixa de estoque, pasta e equipamento',
      'Lembrancinha de aniversário e casamento'
    ],
    enviar:
      'Onde o adesivo vai ser colado, medida aproximada, o que precisa estar escrito, quantidade e a data do evento, quando houver.',
    mensagem: 'Olá! Quero orçamento de adesivos para divulgação ou evento.'
  }
];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro
          eyebrow="Serviços"
          title="Adesivos e etiquetas feitos para o seu produto."
          lead="A Stick Adesivos imprime adesivo personalizado, etiqueta de embalagem e material de divulgação em Criciúma/SC. Você escolhe formato, tamanho e material, aprova o modelo e a gente produz."
        />

        {servicos.map((servico) => (
          <InfoCard key={servico.titulo}>
            <SectionHeading text={servico.titulo} />
            <Text style={styles.paraQuem}>{servico.paraQuem}</Text>
            <Paragraph>{servico.descricao}</Paragraph>
            <Paragraph>
              <Text style={styles.forte}>O que você ganha: </Text>
              {servico.beneficio}
            </Paragraph>

            <Text style={styles.subtitulo}>Usos comuns</Text>
            <Bullets items={servico.usos} />

            <Text style={styles.subtitulo}>Para pedir o orçamento, mande</Text>
            <Paragraph>{servico.enviar}</Paragraph>

            <GhostButton label="Pedir orçamento" onPress={() => router.push('/orcamento')} />
          </InfoCard>
        ))}

        <ClosingCTA
          title="Não sabe qual material escolher?"
          text="Mande uma foto da embalagem no WhatsApp. A gente indica o material e o tamanho que funcionam melhor."
          message="Olá! Vi a página de serviços e quero ajuda para escolher o material do meu adesivo."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.md, paddingBottom: 48, gap: spacing.md },
  paraQuem: {
    alignSelf: 'flex-start',
    color: colors.blue,
    backgroundColor: colors.blueSoft,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
    fontSize: 12,
    fontWeight: '700'
  },
  subtitulo: { color: colors.ink, fontSize: 13, fontWeight: '900', marginTop: 4 },
  forte: { color: colors.ink, fontWeight: '800' }
});
