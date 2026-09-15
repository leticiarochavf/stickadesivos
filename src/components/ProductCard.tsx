import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { colors, layout } from '../theme';

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const { addProduct } = useCart();
  const defaultVariant = product.nuvemshopVariants?.[0];
  return <View style={styles.card}>
    <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/produto/[slug]', params: { slug: product.slug } })}>
      <View style={[styles.imageBox, isDesktop && styles.imageBoxDesktop]}><Image source={product.image} style={styles.image} resizeMode="contain" />{product.badge ? <Text style={styles.badge}>{product.badge}</Text> : null}</View>
      <View style={[styles.copy, isDesktop && styles.copyDesktop]}><Text numberOfLines={2} style={[styles.name, isDesktop && styles.nameDesktop]}>{product.name}</Text><Text numberOfLines={1} style={styles.meta}>{product.format} · {product.material}</Text>{product.compareAt && product.compareAt > product.price ? <Text style={styles.compareAt}>{formatBRL(product.compareAt)}</Text> : null}<Text style={[styles.price, isDesktop && styles.priceDesktop]}>{formatBRL(product.price)}</Text><Text style={styles.pix}>Pix, boleto ou cartão</Text></View>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={`Adicionar ${product.name} ao carrinho`} style={[styles.addButton, isDesktop && styles.addButtonDesktop]} onPress={() => addProduct(product, 1, defaultVariant?.label ?? '5x5 cm', '', defaultVariant?.id, defaultVariant?.price)}><Ionicons name="cart-outline" size={20} color={colors.blue} /></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  card: { position: 'relative', flex: 1, minWidth: 0, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.white, overflow: 'hidden' },
  imageBox: { height: 150, backgroundColor: '#FCFCFD', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  imageBoxDesktop: { height: 220 },
  image: { width: '88%', height: '88%' },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.pink, color: colors.white, fontSize: 9, fontWeight: '800', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5 },
  copy: { padding: 11, paddingBottom: 14 },
  copyDesktop: { padding: 16, paddingBottom: 18 },
  name: { minHeight: 34, fontSize: 13, lineHeight: 17, fontWeight: '800', color: colors.ink, paddingRight: 30 },
  nameDesktop: { minHeight: 42, fontSize: 16, lineHeight: 21 },
  meta: { fontSize: 11, color: colors.muted, marginTop: 5 },
  compareAt: { color: colors.muted, fontSize: 11, marginTop: 6, textDecorationLine: 'line-through' },
  price: { color: colors.ink, fontWeight: '800', fontSize: 16, marginTop: 5 },
  priceDesktop: { fontSize: 20, marginTop: 7 },
  pix: { color: colors.text, fontSize: 11, marginTop: 2 },
  addButton: { position: 'absolute', right: 9, bottom: 10, width: 33, height: 33, borderWidth: 1, borderColor: colors.blue, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  addButtonDesktop: { right: 14, bottom: 16, width: 44, height: 44, borderRadius: 9 },
});
