import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { abrirWhatsApp, CampoConfig, dadoPendente, valorOu } from '../config';
import { colors, spacing } from '../theme';

/*
 * Blocos reutilizados pelas telas de conteúdo: serviços,
 * automotivo, orçamento, dúvidas e políticas.
 */

/* Cabeçalho padrão de página institucional */
export function PageIntro({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <View style={styles.intro}>
      <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.lead}>{lead}</Text>
    </View>
  );
}

/* Título de seção, no mesmo desenho do restante do app */
export function SectionHeading({ text, highlight }: { text: string; highlight?: string }) {
  return (
    <Text style={styles.sectionHeading}>
      {text} {highlight ? <Text style={styles.sectionHighlight}>{highlight}</Text> : null}
    </Text>
  );
}

/* Cartão simples com título e texto */
export function InfoCard({
  title,
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

/* Lista com marcador quadrado */
export function Bullets({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={styles.bulletMark} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/* Pergunta que abre e fecha, usada nas dúvidas frequentes */
export function Accordion({
  question,
  children,
  startOpen = false
}: {
  question: string;
  children: React.ReactNode;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);

  return (
    <View style={styles.accordion}>
      <Pressable
        style={styles.accordionHead}
        onPress={() => setOpen((atual) => !atual)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.accordionQuestion}>{question}</Text>
        <Ionicons
          name={open ? 'remove' : 'add'}
          size={20}
          color={colors.blue}
        />
      </Pressable>
      {open ? <View style={styles.accordionBody}>{children}</View> : null}
    </View>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

/* Mostra um dado da configuração, destacando o que falta preencher */
export function Dado({ campo }: { campo: CampoConfig }) {
  const pendente = dadoPendente(campo);
  return (
    <Text style={pendente ? styles.pendente : styles.dado}>{valorOu(campo)}</Text>
  );
}

/*
 * Botão verde de WhatsApp. Quando o número ainda não foi
 * cadastrado, leva para a tela de contato em vez de falhar.
 */
export function WhatsAppButton({
  label = 'Falar no WhatsApp',
  message
}: {
  label?: string;
  message: string;
}) {
  const router = useRouter();

  const onPress = async () => {
    const abriu = await abrirWhatsApp(message);
    if (!abriu) router.push('/(tabs)/contato');
  };

  return (
    <Pressable style={styles.whatsapp} onPress={onPress} accessibilityRole="button">
      <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
      <Text style={styles.whatsappText}>{label}</Text>
    </Pressable>
  );
}

/* Botão azul principal */
export function PrimaryButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primary} onPress={onPress} accessibilityRole="button">
      <Text style={styles.primaryText}>{label}</Text>
      <Ionicons name="arrow-forward" size={16} color={colors.white} />
    </Pressable>
  );
}

/* Botão contornado, para a ação secundária */
export function GhostButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.ghost} onPress={onPress} accessibilityRole="button">
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

/* Bloco final de chamada, repetido no fim das telas de conteúdo */
export function ClosingCTA({
  title,
  text,
  message
}: {
  title: string;
  text: string;
  message: string;
}) {
  const router = useRouter();

  return (
    <View style={styles.closing}>
      <Text style={styles.closingTitle}>{title}</Text>
      <Text style={styles.closingText}>{text}</Text>
      <WhatsAppButton message={message} />
      <GhostButton label="Pedir orçamento" onPress={() => router.push('/orcamento')} />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.lg },
  eyebrow: { color: colors.blue, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '900', marginTop: 8 },
  lead: { color: colors.text, fontSize: 14, lineHeight: 21, marginTop: 11 },

  sectionHeading: { color: colors.ink, fontSize: 20, fontWeight: '900', marginBottom: spacing.sm },
  sectionHighlight: { color: colors.pink },

  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: spacing.md,
    backgroundColor: colors.white,
    gap: 8
  },
  cardTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },

  bullets: { gap: 7, marginTop: 2 },
  bulletRow: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  bulletMark: { width: 7, height: 7, borderRadius: 2, backgroundColor: colors.yellow, marginTop: 6 },
  bulletText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19 },

  accordion: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, marginBottom: 9, backgroundColor: colors.white },
  accordionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: spacing.md },
  accordionQuestion: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: '800' },
  accordionBody: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: 8 },

  paragraph: { color: colors.text, fontSize: 13, lineHeight: 20 },

  dado: { color: colors.text, fontSize: 13, fontWeight: '700' },
  pendente: { color: '#8A6D00', backgroundColor: '#FDF3D6', fontSize: 13, fontStyle: 'italic' },

  whatsapp: {
    backgroundColor: '#1FAA53',
    minHeight: 46,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9
  },
  whatsappText: { color: colors.white, fontWeight: '800', fontSize: 13 },

  primary: {
    backgroundColor: colors.blue,
    minHeight: 46,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  primaryText: { color: colors.white, textTransform: 'uppercase', fontWeight: '800', fontSize: 12 },

  ghost: {
    borderWidth: 2,
    borderColor: colors.blue,
    minHeight: 44,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ghostText: { color: colors.blue, fontWeight: '800', fontSize: 13 },

  closing: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.blueSoft,
    gap: 10
  },
  closingTitle: { color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: '900' },
  closingText: { color: colors.text, fontSize: 13, lineHeight: 19 }
});
