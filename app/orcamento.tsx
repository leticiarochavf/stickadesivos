import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import {
  Bullets,
  Dado,
  InfoCard,
  PageIntro,
  Paragraph,
  WhatsAppButton
} from '../src/components/PageBlocks';
import { abrirWhatsApp } from '../src/config';
import { colors, spacing } from '../src/theme';

/*
 * Tela de orçamento.
 * Junta as respostas numa mensagem e abre o WhatsApp já escrito.
 * Nada é enviado para servidor: quem envia é a própria pessoa,
 * dentro do WhatsApp, onde também pode anexar a arte.
 */

const tiposDePedido = [
  'Adesivo personalizado',
  'Etiqueta para embalagem',
  'Lacre de segurança',
  'Adesivo automotivo ou número de arrancada',
  'Adesivo para evento',
  'Ainda não sei, preciso de ajuda'
];

const situacoesDeArte = [
  'Tenho o arquivo pronto',
  'Tenho o logo, mas não o layout',
  'Não tenho nada ainda'
];

export default function QuoteScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState(tiposDePedido[0]);
  const [formato, setFormato] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [prazo, setPrazo] = useState('');
  const [arte, setArte] = useState(situacoesDeArte[0]);
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');

  const enviar = async () => {
    if (!nome.trim() || !quantidade.trim()) {
      setErro('Preencha ao menos o nome e a quantidade.');
      return;
    }

    setErro('');

    const linhas = [
      'Olá! Quero um orçamento na Stick Adesivos.',
      '',
      `Nome: ${nome.trim()}`,
      `Produto: ${tipo}`,
      `Formato ou tamanho: ${formato.trim() || '-'}`,
      `Quantidade: ${quantidade.trim()}`,
      `Prazo desejado: ${prazo.trim() || 'sem data definida'}`,
      `Arte: ${arte}`
    ];

    if (observacao.trim()) {
      linhas.push('', `Observações: ${observacao.trim()}`);
    }

    const abriu = await abrirWhatsApp(linhas.join('\n'));
    if (!abriu) router.push('/(tabs)/contato');
  };

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro
          eyebrow="Orçamento"
          title="Peça seu orçamento em um minuto."
          lead="Preencha os campos abaixo. Ao enviar, o WhatsApp abre com a mensagem já escrita, e você só precisa apertar enviar. A arte pode ser anexada direto na conversa."
        />

        <InfoCard title="Dados do pedido">
          <Campo label="Seu nome" value={nome} onChange={setNome} />

          <Escolha
            label="O que você precisa"
            options={tiposDePedido}
            value={tipo}
            onChange={setTipo}
          />

          <Campo
            label="Formato ou tamanho"
            hint="se já souber"
            value={formato}
            onChange={setFormato}
            placeholder="Ex.: redondo 5 cm"
          />

          <Campo
            label="Quantidade"
            value={quantidade}
            onChange={setQuantidade}
            placeholder="Ex.: 500"
            keyboard="numeric"
          />

          <Campo
            label="Para quando você precisa"
            value={prazo}
            onChange={setPrazo}
            placeholder="Ex.: até o dia 30"
          />

          <Escolha
            label="Você já tem a arte?"
            options={situacoesDeArte}
            value={arte}
            onChange={setArte}
          />

          <Campo
            label="Quer contar mais alguma coisa?"
            value={observacao}
            onChange={setObservacao}
            placeholder="Onde o adesivo vai ser colado, cores, referências..."
            multiline
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Pressable style={styles.enviar} onPress={enviar} accessibilityRole="button">
            <Text style={styles.enviarTexto}>Enviar pelo WhatsApp</Text>
          </Pressable>

          <Text style={styles.nota}>
            Aceitamos PDF, AI, CDR, PNG e JPG. O arquivo vai anexado dentro da conversa.
          </Text>
        </InfoCard>

        <View style={styles.aside}>
          <Text style={styles.asideTitle}>Como funciona depois do envio</Text>
          <Bullets
            items={[
              'A gente responde com valor, material indicado e prazo.',
              'Você envia a arte ou a gente monta o modelo com as informações do pedido.',
              'Você aprova o modelo. Só depois do seu ok a impressão começa.',
              'Retirada em Criciúma ou envio para todo o Brasil.'
            ]}
          />

          <View style={styles.contato}>
            <Paragraph>
              Produção: <Dado campo="prazoProducao" />
            </Paragraph>
            <Paragraph>
              Atendimento: <Dado campo="horario" />
            </Paragraph>
            <Paragraph>
              Telefone: <Dado campo="telefone" />
            </Paragraph>
          </View>

          <WhatsAppButton
            label="Prefiro falar direto"
            message="Olá! Quero falar sobre um orçamento de adesivos."
          />
        </View>
      </ScrollView>
    </View>
  );
}

function Campo({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
  keyboard
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboard?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>
        {label} {hint ? <Text style={styles.hint}>({hint})</Text> : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboard || 'default'}
        multiline={multiline}
        style={[styles.input, multiline ? styles.inputMultiline : null]}
      />
    </View>
  );
}

function Escolha({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.opcoes}>
        {options.map((opcao) => {
          const ativo = opcao === value;
          return (
            <Pressable
              key={opcao}
              onPress={() => onChange(opcao)}
              style={[styles.opcao, ativo ? styles.opcaoAtiva : null]}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativo }}
            >
              <Text style={[styles.opcaoTexto, ativo ? styles.opcaoTextoAtivo : null]}>
                {opcao}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.md, paddingBottom: 48, gap: spacing.md },

  campo: { gap: 5 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700' },
  hint: { color: colors.muted, fontWeight: '400' },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    color: colors.ink,
    fontSize: 14
  },
  inputMultiline: { minHeight: 88, paddingTop: 10, textAlignVertical: 'top' },

  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  opcao: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 13
  },
  opcaoAtiva: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  opcaoTexto: { color: colors.text, fontSize: 12 },
  opcaoTextoAtivo: { color: colors.blue, fontWeight: '800' },

  erro: {
    color: '#A01035',
    backgroundColor: '#FDECEF',
    borderRadius: 6,
    padding: 10,
    fontSize: 13
  },

  enviar: {
    backgroundColor: '#1FAA53',
    minHeight: 48,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  enviarTexto: { color: colors.white, fontWeight: '800', fontSize: 14 },
  nota: { color: colors.muted, fontSize: 11, lineHeight: 16 },

  aside: {
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: spacing.md,
    gap: 12
  },
  asideTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  contato: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 11, gap: 4 }
});
