import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { colors, spacing } from '../theme';

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addProduct } = useCart();
  const defaultVariant = product.nuvemshopVariants?.[0];
  return <View style={styles.card}>
    <Pressable onPress={() => router.push({ pathname: '/produto/[slug]', params: { slug: product.slug } })}>
      <View style={styles.imageBox}><Image source={product.image} style={styles.image} resizeMode="contain" />{product.badge ? <Text style={styles.badge}>{product.badge}</Text> : null}</View>
      <View style={styles.copy}><Text numberOfLines={2} style={styles.name}>{product.name}</Text><Text style={styles.meta}>{product.format} · {product.material}</Text>{product.compareAt && product.compareAt > product.price ? <Text style={styles.compareAt}>{formatBRL(product.compareAt)}</Text> : null}<Text style={styles.price}>{formatBRL(product.price)}</Text><Text style={styles.pix}>Pix, boleto ou cartão</Text></View>
    </Pressable>
    <Pressable style={styles.addButton} onPress={() => addProduct(product, 1, defaultVariant?.label ?? '5x5 cm', '', defaultVariant?.id, defaultVariant?.price)}><Ionicons name="cart-outline" size={19} color={colors.blue} /></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  card: { position: 'relative', flex: 1, minWidth: 0, borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: colors.white, overflow: 'hidden' },
  imageBox: { height: 150, backgroundColor: '#FCFCFD', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  image: { width: '92%', height: '92%' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.pink, color: colors.white, fontSize: 8, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  copy: { padding: 11, paddingBottom: 14 },
  name: { fontSize: 13, lineHeight: 17, fontWeight: '800', color: colors.ink, paddingRight: 22 },
  meta: { fontSize: 10, color: colors.muted, marginTop: 4 },
  compareAt: { color: colors.muted, fontSize: 11, marginTop: 6, textDecorationLine: 'line-through' },
  price: { color: colors.ink, fontWeight: '800', fontSize: 16, marginTop: 5 },
  pix: { color: colors.text, fontSize: 10 },
  addButton: { position: 'absolute', right: 9, bottom: 10, width: 33, height: 33, borderWidth: 1, borderColor: colors.blue, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }
});
