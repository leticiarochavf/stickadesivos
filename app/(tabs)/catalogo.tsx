import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { ProductCard } from '../../src/components/ProductCard';
import { useProductCatalog } from '../../src/context/ProductCatalogContext';
import { colors, layout, spacing } from '../../src/theme';
import { SiteHeader } from '../../src/components/SiteHeader';

/*
 * As opções de filtro saem do próprio catálogo, e não de uma lista
 * fixa. Com o catálogo vindo da loja pela API, uma lista fixa
 * mostraria filtros que não têm produto e esconderia categorias
 * que existem.
 */
function opcoesDe(produtos: { [k: string]: any }[], campo: string) {
  const valores = produtos
    .map((produto) => String(produto[campo] || '').trim())
    .filter(Boolean);
  return ['Todos', ...Array.from(new Set(valores)).sort((a, b) => a.localeCompare(b, 'pt-BR'))];
}

export default function CatalogScreen() {
  const params = useLocalSearchParams<{ categoria?: string; busca?: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const isTablet = width >= layout.tabletBreakpoint;
  const { products } = useProductCatalog();
  const [category, setCategory] = useState(params.categoria || 'Todos');
  const [material, setMaterial] = useState('Todos');
  const [term, setTerm] = useState(params.busca || '');
  const [sort, setSort] = useState<'featured' | 'asc' | 'desc'>('featured');
  const categoryOptions = useMemo(() => opcoesDe(products, 'category'), [products]);
  const materialOptions = useMemo(() => opcoesDe(products, 'material'), [products]);
  const filtered = useMemo(() => {
    const normalized = term.toLowerCase().trim();
    const result = products.filter((product) => (category === 'Todos' || product.category === category) && (material === 'Todos' || product.material === material) && (!normalized || `${product.name} ${product.format} ${product.material}`.toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.id - b.id);
  }, [category, material, products, sort, term]);
  return <View style={styles.screen}><SiteHeader search={term} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.page}>
    <View style={styles.breadcrumb}><Text style={styles.breadcrumbBlue} onPress={() => router.push('/(tabs)')}>Página inicial</Text><Text style={styles.breadcrumbSep}>›</Text><Text style={styles.breadcrumbText}>Catálogo</Text></View>
    <View style={[styles.catalogHero, isDesktop && styles.catalogHeroDesktop]}><View style={{ flex: 1 }}><Text style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop]}>Adesivos <Text style={styles.blue}>personalizados</Text></Text><Text style={[styles.heroText, isDesktop && styles.heroTextDesktop]}>Encontre o formato e o material ideais para sua marca, embalagem ou produto.</Text><View style={styles.heroTags}><Text style={styles.heroTag}>Vários formatos</Text><Text style={styles.heroTag}>Materiais selecionados</Text></View></View><Image source={require('../../assets/images/hero-products.png')} style={[styles.heroImage, isDesktop && styles.heroImageDesktop]} resizeMode="contain" /></View>
    <View style={styles.filtersHeader}><Text style={styles.resultCount}>{filtered.length} produtos encontrados</Text><Pressable style={styles.sortButton} onPress={() => setSort(sort === 'featured' ? 'asc' : sort === 'asc' ? 'desc' : 'featured')}><Ionicons name="swap-vertical-outline" size={16} color={colors.blue} /><Text style={styles.sortText}>{sort === 'featured' ? 'Destaques' : sort === 'asc' ? 'Menor preço' : 'Maior preço'}</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Text style={styles.filterCaption}>Categorias</Text>{categoryOptions.map((option) => <Pressable key={option} onPress={() => setCategory(option)} style={[styles.chip, category === option && styles.chipActive]}><Text style={[styles.chipText, category === option && styles.chipTextActive]}>{option}</Text></Pressable>)}</ScrollView>
    {materialOptions.length > 2 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Text style={styles.filterCaption}>Material</Text>{materialOptions.map((option) => <Pressable key={option} onPress={() => setMaterial(option)} style={[styles.chip, material === option && styles.chipActive]}><Text style={[styles.chipText, material === option && styles.chipTextActive]}>{option}</Text></Pressable>)}</ScrollView> : null}
    <TextInput value={term} onChangeText={setTerm} placeholder="Buscar no catálogo" placeholderTextColor={colors.muted} style={styles.catalogSearch} />
    {filtered.length ? <View style={styles.grid}>{filtered.map((product) => <View key={product.id} style={[styles.gridItem, isTablet && styles.gridItemTablet, isDesktop && styles.gridItemDesktop]}><ProductCard product={product} /></View>)}</View> : <View style={styles.empty}><Ionicons name="search-outline" size={38} color={colors.muted} /><Text style={styles.emptyTitle}>Nenhum produto encontrado</Text><Text style={styles.emptyText}>Remova alguns filtros ou faça uma nova busca.</Text></View>}
  </View></ScrollView></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.white }, content: { paddingBottom: 48 }, page: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }, breadcrumb: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, paddingTop: 18, paddingBottom: 14 }, breadcrumbBlue: { color: colors.blue, fontSize: 13, fontWeight: '700' }, breadcrumbSep: { color: colors.muted }, breadcrumbText: { color: colors.text, fontSize: 13 }, catalogHero: { marginHorizontal: spacing.md, minHeight: 200, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: spacing.md, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#FCFCFD' }, catalogHeroDesktop: { minHeight: 260, marginHorizontal: spacing.lg, padding: spacing.xl, borderRadius: 18 }, heroTitle: { color: colors.ink, fontSize: 27, lineHeight: 33, fontWeight: '900' }, heroTitleDesktop: { fontSize: 42, lineHeight: 48 }, blue: { color: colors.blue }, heroText: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 8, maxWidth: 250 }, heroTextDesktop: { fontSize: 17, lineHeight: 25, maxWidth: 520 }, heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 16 }, heroTag: { color: colors.blue, fontSize: 11, fontWeight: '700', borderWidth: 1, borderColor: '#C9D9F9', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 }, heroImage: { width: 140, height: 150, alignSelf: 'center', marginRight: -25 }, heroImageDesktop: { width: 340, height: 220, marginRight: 0 }, filtersHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, resultCount: { color: colors.ink, fontSize: 14, fontWeight: '700' }, sortButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }, sortText: { color: colors.text, fontSize: 12 }, chips: { paddingHorizontal: spacing.lg, gap: 8, alignItems: 'center', paddingBottom: 10 }, filterCaption: { color: colors.ink, fontWeight: '800', fontSize: 12, marginRight: 3 }, chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.white }, chipActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft }, chipText: { color: colors.text, fontSize: 12 }, chipTextActive: { color: colors.blue, fontWeight: '800' }, catalogSearch: { height: 46, marginHorizontal: spacing.lg, marginTop: 4, marginBottom: 20, borderWidth: 1, borderColor: colors.line, borderRadius: 9, paddingHorizontal: 15, color: colors.ink, fontSize: 14 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: spacing.lg }, gridItem: { width: '48%' }, gridItemTablet: { width: '31.9%' }, gridItemDesktop: { width: '23.75%' }, empty: { alignItems: 'center', padding: 48, marginHorizontal: spacing.lg, backgroundColor: colors.soft, borderRadius: 14 }, emptyTitle: { fontWeight: '900', fontSize: 19, color: colors.ink, marginTop: 12 }, emptyText: { color: colors.muted, marginTop: 6, textAlign: 'center' }
});
