import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SiteHeader } from '../src/components/SiteHeader';
import { useCart } from '../src/context/CartContext';
import { irParaCheckout } from '../src/integrations/nuvemshopCheckout';
import { colors, layout, spacing } from '../src/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total } = useCart();
  const [erro, setErro] = useState('');

  const finalizar = async () => {
    setErro('');
    const resultado = await irParaCheckout(items);

    if (!resultado.ok) {
      setErro(
        resultado.motivo === 'carrinho-vazio'
          ? 'Seu carrinho está vazio.'
          : `O produto "${resultado.itemSemVariante}" ainda não está ligado à loja. Fale com a gente pelo WhatsApp.`,
      );
    }
  };

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable accessibilityRole="button" style={styles.back} onPress={() => router.push('/(tabs)/carrinho')}>
            <Ionicons name="arrow-back" size={16} color={colors.blue} />
            <Text style={styles.backText}>Voltar ao carrinho</Text>
          </Pressable>

          <Text style={styles.title}>Pagamento <Text style={styles.pink}>seguro</Text></Text>
          <Text style={styles.lead}>
            Você continuará no checkout oficial da Nuvemshop, com as opções de pagamento e entrega configuradas para a loja.
          </Text>

          <View style={styles.trustBox}>
            <View style={styles.trustIcon}><Ionicons name="shield-checkmark-outline" size={26} color={colors.success} /></View>
            <View style={styles.trustCopy}>
              <Text style={styles.trustTitle}>Seus dados ficam protegidos</Text>
              <Text style={styles.trustText}>Endereço, entrega e pagamento são preenchidos diretamente no ambiente seguro da Nuvemshop.</Text>
            </View>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxTitle}>Resumo do pedido</Text>
            <View style={styles.line}><Text style={styles.label}>Itens</Text><Text style={styles.value}>{items.length}</Text></View>
            <View style={styles.line}><Text style={styles.label}>Subtotal</Text><Text style={styles.value}>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></View>
            <View style={styles.line}><Text style={styles.label}>Frete</Text><Text style={styles.value}>Calculado no checkout</Text></View>
            <View style={styles.divider} />
            <View style={styles.line}><Text style={styles.totalLabel}>Total parcial</Text><Text style={styles.totalValue}>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></View>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Pressable accessibilityRole="button" style={styles.primary} onPress={finalizar}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.white} />
              <Text style={styles.primaryText}>Ir para pagamento</Text>
            </Pressable>
            <Text style={styles.note}>Pix, cartão e demais opções aparecem conforme a configuração ativa do Nuvem Pago.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scrollContent: { width: '100%', paddingHorizontal: spacing.md, paddingVertical: spacing.xl, paddingBottom: 56 },
  content: { width: '100%', maxWidth: layout.readingWidth, alignSelf: 'center' },
  back: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backText: { color: colors.blue, fontSize: 13, fontWeight: '800' },
  title: { color: colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900' },
  pink: { color: colors.pink },
  lead: { color: colors.text, fontSize: 16, lineHeight: 24, marginTop: 8 },
  trustBox: { marginTop: spacing.lg, borderWidth: 1, borderColor: '#CFEADB', borderRadius: 14, backgroundColor: '#F4FBF7', padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  trustIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E3F6EA', alignItems: 'center', justifyContent: 'center' },
  trustCopy: { flex: 1 },
  trustTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  trustText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 3 },
  box: { marginTop: spacing.md, borderRadius: 16, padding: spacing.lg, backgroundColor: colors.blueSoft },
  boxTitle: { color: colors.ink, fontSize: 20, fontWeight: '900', marginBottom: spacing.md },
  line: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  label: { color: colors.text, fontSize: 14 },
  value: { color: colors.text, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#D6E1F3', marginVertical: spacing.sm },
  totalLabel: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  totalValue: { color: colors.blue, fontSize: 24, fontWeight: '900' },
  erro: { marginTop: spacing.md, padding: 12, borderRadius: 9, backgroundColor: '#FDECEF', color: '#A01035', fontSize: 13, lineHeight: 19 },
  primary: { marginTop: spacing.lg, minHeight: 52, borderRadius: 10, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: colors.white, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  note: { color: colors.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: spacing.sm },
});
