import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ProductCard } from '../../src/components/ProductCard';
import { useProductCatalog } from '../../src/context/ProductCatalogContext';
import { colors, spacing } from '../../src/theme';
import { SiteHeader } from '../../src/components/SiteHeader';

const categoryOptions = ['Todos', 'Adesivos', 'Lacres', 'Etiquetas'];
const materialOptions = ['Todos', 'Vinil Brilho', 'Vinil Fosco', 'Transparente', 'Holográfico', 'Kraft', 'Void'];

export default function CatalogScreen() {
  const params = useLocalSearchParams<{ categoria?: string; busca?: string }>();
  const router = useRouter();
  const { products } = useProductCatalog();
  const [category, setCategory] = useState(params.categoria || 'Todos');
  const [material, setMaterial] = useState('Todos');
  const [term, setTerm] = useState(params.busca || '');
  const [sort, setSort] = useState<'featured' | 'asc' | 'desc'>('featured');
  const filtered = useMemo(() => {
    const normalized = term.toLowerCase().trim();
    const result = products.filter((product) => (category === 'Todos' || product.category === category) && (material === 'Todos' || product.material === material) && (!normalized || `${product.name} ${product.format} ${product.material}`.toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.id - b.id);
  }, [category, material, products, sort, term]);
  return <View style={styles.screen}><SiteHeader search={term} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.breadcrumb}><Text style={styles.breadcrumbBlue} onPress={() => router.push('/(tabs)')}>Página inicial</Text><Text style={styles.breadcrumbSep}>›</Text><Text style={styles.breadcrumbText}>Catálogo</Text></View>
    <View style={styles.catalogHero}><View style={{ flex: 1 }}><Text style={styles.heroTitle}>Adesivos <Text style={styles.blue}>personalizados</Text></Text><Text style={styles.heroText}>Encontre o formato e o material ideais para sua marca, embalagem ou produto.</Text><View style={styles.heroTags}><Text style={styles.heroTag}>Vários formatos</Text><Text style={styles.heroTag}>Materiais selecionados</Text></View></View><Image source={require('../../assets/images/hero-products.png')} style={styles.heroImage} resizeMode="contain" /></View>
    <View style={styles.filtersHeader}><Text style={styles.resultCount}>{filtered.length} produtos encontrados</Text><Pressable style={styles.sortButton} onPress={() => setSort(sort === 'featured' ? 'asc' : sort === 'asc' ? 'desc' : 'featured')}><Ionicons name="swap-vertical-outline" size={16} color={colors.blue} /><Text style={styles.sortText}>{sort === 'featured' ? 'Destaques' : sort === 'asc' ? 'Menor preço' : 'Maior preço'}</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Text style={styles.filterCaption}>Categorias</Text>{categoryOptions.map((option) => <Pressable key={option} onPress={() => setCategory(option)} style={[styles.chip, category === option && styles.chipActive]}><Text style={[styles.chipText, category === option && styles.chipTextActive]}>{option}</Text></Pressable>)}</ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Text style={styles.filterCaption}>Material</Text>{materialOptions.map((option) => <Pressable key={option} onPress={() => setMaterial(option)} style={[styles.chip, material === option && styles.chipActive]}><Text style={[styles.chipText, material === option && styles.chipTextActive]}>{option}</Text></Pressable>)}</ScrollView>
    <TextInput value={term} onChangeText={setTerm} placeholder="Buscar no catálogo" placeholderTextColor={colors.muted} style={styles.catalogSearch} />
    {filtered.length ? <View style={styles.grid}>{filtered.map((product) => <View key={product.id} style={styles.gridItem}><ProductCard product={product} /></View>)}</View> : <View style={styles.empty}><Ionicons name="search-outline" size={38} color={colors.muted} /><Text style={styles.emptyTitle}>Nenhum produto encontrado</Text><Text style={styles.emptyText}>Remova alguns filtros ou faça uma nova busca.</Text></View>}
  </ScrollView></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.white }, content: { paddingBottom: 34 }, breadcrumb: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.md, paddingTop: 14, paddingBottom: 12 }, breadcrumbBlue: { color: colors.blue, fontSize: 12, fontWeight: '700' }, breadcrumbSep: { color: colors.muted }, breadcrumbText: { color: colors.text, fontSize: 12 }, catalogHero: { marginHorizontal: spacing.md, minHeight: 185, borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: spacing.md, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#FCFCFD' }, heroTitle: { color: colors.ink, fontSize: 25, fontWeight: '900' }, blue: { color: colors.blue }, heroText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 225 }, heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 15 }, heroTag: { color: colors.blue, fontSize: 10, fontWeight: '700', borderWidth: 1, borderColor: '#C9D9F9', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 }, heroImage: { width: 135, height: 140, alignSelf: 'center', marginRight: -25 }, filtersHeader: { padding: spacing.md, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, resultCount: { color: colors.ink, fontSize: 13, fontWeight: '700' }, sortButton: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.line, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 7 }, sortText: { color: colors.text, fontSize: 11 }, chips: { paddingHorizontal: spacing.md, gap: 7, alignItems: 'center', paddingBottom: 9 }, filterCaption: { color: colors.ink, fontWeight: '800', fontSize: 11, marginRight: 2 }, chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.white }, chipActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft }, chipText: { color: colors.text, fontSize: 11 }, chipTextActive: { color: colors.blue, fontWeight: '800' }, catalogSearch: { height: 43, marginHorizontal: spacing.md, marginTop: 3, marginBottom: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 7, paddingHorizontal: 13, color: colors.ink, fontSize: 13 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: spacing.md }, gridItem: { width: '48.2%' }, empty: { alignItems: 'center', padding: 45, marginHorizontal: spacing.md, backgroundColor: colors.soft, borderRadius: 10 }, emptyTitle: { fontWeight: '900', fontSize: 18, color: colors.ink, marginTop: 12 }, emptyText: { color: colors.muted, marginTop: 5, textAlign: 'center' }
});
