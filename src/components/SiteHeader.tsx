import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { colors, layout, spacing } from '../theme';

export function SiteHeader({ search = '' }: { search?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const { count } = useCart();
  const [term, setTerm] = useState(search);
  const searchProducts = () => router.push({ pathname: '/(tabs)/catalogo', params: term.trim() ? { busca: term.trim() } : {} });

  const searchField = <View style={[styles.searchRow, isDesktop && styles.searchRowDesktop]}>
    <TextInput value={term} onChangeText={setTerm} onSubmitEditing={searchProducts} placeholder="O que você está procurando?" placeholderTextColor={colors.muted} style={styles.searchInput} returnKeyType="search" />
    <Pressable accessibilityRole="button" accessibilityLabel="Buscar produtos" onPress={searchProducts} style={styles.searchButton}><Ionicons name="search" size={21} color={colors.white} /></Pressable>
  </View>;

  return <>
    <View style={styles.topbar}>
      <View style={styles.topbarContent}>
        <View style={styles.topItem}><Ionicons name="flash-outline" size={15} color={colors.blue} /><Text style={styles.topText}>Produção rápida</Text></View>
        <View style={styles.topItem}><Ionicons name="car-outline" size={15} color={colors.blue} /><Text style={styles.topText}>Enviamos para todo Brasil</Text></View>
        <View style={styles.topItem}><Ionicons name="logo-whatsapp" size={15} color={colors.success} /><Text style={styles.topText}>Atendimento via WhatsApp</Text></View>
      </View>
    </View>
    <View style={styles.header}>
      <View style={[styles.headerRow, isDesktop && styles.headerRowDesktop]}>
        <Pressable onPress={() => router.push('/(tabs)')}><Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" /></Pressable>
        {isDesktop ? searchField : null}
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" style={styles.actionButton} onPress={() => router.push('/contato')}><Ionicons name="person-outline" size={23} color={colors.ink} /><Text style={styles.actionLabel}>Atendimento</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Carrinho com ${count} itens`} style={styles.cartButton} onPress={() => router.push('/(tabs)/carrinho')}><Ionicons name="cart-outline" size={25} color={colors.blue} /><View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View></Pressable>
        </View>
      </View>
      {!isDesktop ? searchField : null}
      <View style={styles.navOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.navScroll, isDesktop && styles.navScrollDesktop]}>
          <NavItem label="Início" active={pathname === '/'} onPress={() => router.push('/(tabs)')} />
          <NavItem label="Personalizados" active={pathname === '/catalogo'} onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Adesivos' } })} />
          <NavItem label="Lacres" onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Lacres' } })} />
          <NavItem label="Etiquetas" onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Etiquetas' } })} />
          <NavItem label="Automotivo" active={pathname === '/automotivo'} onPress={() => router.push('/automotivo')} />
          <NavItem label="Serviços" active={pathname === '/servicos'} onPress={() => router.push('/servicos')} />
          <NavItem label="Orçamento" active={pathname === '/orcamento'} onPress={() => router.push('/orcamento')} />
          <NavItem label="Dúvidas" active={pathname === '/faq'} onPress={() => router.push('/faq')} />
          <NavItem label="Sobre nós" active={pathname === '/sobre'} onPress={() => router.push('/sobre')} />
        </ScrollView>
      </View>
    </View>
  </>;
}

function NavItem({ label, active = false, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="link" onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}><Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  topbar: { minHeight: 32, backgroundColor: '#FAFBFC', borderBottomWidth: 1, borderBottomColor: '#EEF0F3', justifyContent: 'center' },
  topbarContent: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', minHeight: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md },
  topItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topText: { fontSize: 10, color: colors.text, fontWeight: '600' },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line },
  headerRow: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', minHeight: 68, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerRowDesktop: { minHeight: 82, paddingHorizontal: spacing.lg, gap: spacing.xl },
  logo: { width: 112, height: 58 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actionButton: { alignItems: 'center', gap: 2 },
  actionLabel: { fontSize: 11, color: colors.text },
  cartButton: { position: 'relative', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  searchRow: { width: 'auto', height: 44, marginHorizontal: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', borderWidth: 1, borderColor: '#D8DEE8', borderRadius: 9, overflow: 'hidden', backgroundColor: colors.white },
  searchRowDesktop: { flex: 1, maxWidth: 650, marginHorizontal: 0, marginBottom: 0, height: 46 },
  searchInput: { flex: 1, paddingHorizontal: 15, color: colors.ink, fontSize: 14 },
  searchButton: { width: 50, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  navOuter: { width: '100%', borderTopWidth: 1, borderTopColor: '#F0F2F5' },
  navScroll: { minWidth: '100%', paddingHorizontal: spacing.md, gap: spacing.lg, paddingVertical: 10 },
  navScrollDesktop: { maxWidth: layout.maxWidth, alignSelf: 'center', paddingHorizontal: spacing.lg, gap: spacing.xl, justifyContent: 'center' },
  navItem: { paddingVertical: 5, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  navItemActive: { borderBottomColor: colors.blue },
  navText: { textTransform: 'uppercase', fontSize: 11, fontWeight: '800', color: colors.ink },
  navTextActive: { color: colors.blue },
});
