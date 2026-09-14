import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { colors, spacing } from '../theme';

export function SiteHeader({ search = '' }: { search?: string }) {
  const router = useRouter();
  const { count } = useCart();
  const [term, setTerm] = useState(search);
  const searchProducts = () => router.push({ pathname: '/(tabs)/catalogo', params: term.trim() ? { busca: term.trim() } : {} });

  return <>
    <View style={styles.topbar}>
      <View style={styles.topItem}><Ionicons name="flash-outline" size={16} color={colors.blue} /><Text style={styles.topText}>Produção rápida</Text></View>
      <View style={styles.topItem}><Ionicons name="car-outline" size={16} color={colors.blue} /><Text style={styles.topText}>Enviamos para todo Brasil</Text></View>
      <View style={styles.topItem}><Ionicons name="logo-whatsapp" size={16} color={colors.success} /><Text style={styles.topText}>Atendimento via WhatsApp</Text></View>
    </View>
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push('/(tabs)')}><Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" /></Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/contato')}><Ionicons name="person-outline" size={22} color={colors.ink} /><Text style={styles.actionLabel}>Atendimento</Text></Pressable>
          <Pressable style={styles.cartButton} onPress={() => router.push('/(tabs)/carrinho')}><Ionicons name="cart-outline" size={24} color={colors.blue} /><View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View></Pressable>
        </View>
      </View>
      <View style={styles.searchRow}>
        <TextInput value={term} onChangeText={setTerm} onSubmitEditing={searchProducts} placeholder="O que você está procurando?" placeholderTextColor={colors.muted} style={styles.searchInput} returnKeyType="search" />
        <Pressable onPress={searchProducts} style={styles.searchButton}><Ionicons name="search" size={21} color={colors.white} /></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
        <NavItem label="Início" onPress={() => router.push('/(tabs)')} />
        <NavItem label="Personalizados" onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Adesivos' } })} />
        <NavItem label="Lacres" onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Lacres' } })} />
        <NavItem label="Etiquetas" onPress={() => router.push({ pathname: '/(tabs)/catalogo', params: { categoria: 'Etiquetas' } })} />
        <NavItem label="Automotivo" onPress={() => router.push('/automotivo')} />
        <NavItem label="Serviços" onPress={() => router.push('/servicos')} />
        <NavItem label="Orçamento" onPress={() => router.push('/orcamento')} />
        <NavItem label="Dúvidas" onPress={() => router.push('/faq')} />
        <NavItem label="Sobre nós" onPress={() => router.push('/sobre')} />
      </ScrollView>
    </View>
  </>;
}

function NavItem({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.navItem}><Text style={styles.navText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  topbar: { minHeight: 34, backgroundColor: '#FAFBFC', borderBottomWidth: 1, borderBottomColor: '#EEF0F3', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 6 },
  topItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topText: { fontSize: 9, color: colors.text, fontWeight: '600' },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line, paddingTop: spacing.sm },
  headerRow: { minHeight: 70, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 116, height: 62 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionButton: { alignItems: 'center', gap: 2 },
  actionLabel: { fontSize: 10, color: colors.text },
  cartButton: { position: 'relative', padding: 5 },
  badge: { position: 'absolute', top: -2, right: -4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  searchRow: { height: 44, marginHorizontal: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', borderWidth: 1, borderColor: colors.line, borderRadius: 7, overflow: 'hidden' },
  searchInput: { flex: 1, paddingHorizontal: 13, color: colors.ink, fontSize: 13 },
  searchButton: { width: 48, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  navScroll: { paddingHorizontal: spacing.md, gap: 24, paddingBottom: 11 },
  navItem: { paddingVertical: 4 },
  navText: { textTransform: 'uppercase', fontSize: 10, fontWeight: '800', color: colors.ink }
});
