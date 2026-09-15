import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SiteHeader } from "../../src/components/SiteHeader";
import { formatBRL, ProductCard } from "../../src/components/ProductCard";
import { findProduct } from "../../src/data/products";
import { useProductCatalog } from "../../src/context/ProductCatalogContext";
import { useCart } from "../../src/context/CartContext";
import { colors, layout, spacing } from "../../src/theme";

const sizes = ["3x3 cm", "5x5 cm", "7x7 cm", "10x10 cm", "Personalizado"];

export default function ProductScreen() {
  const params = useLocalSearchParams<{ slug?: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const { products } = useProductCatalog();
  const product = findProduct(params.slug, products);
  const { addProduct } = useCart();
  const [size, setSize] = useState("5x5 cm");
  const [qty, setQty] = useState(1);
  const [artworkName, setArtworkName] = useState("");
  const [cep, setCep] = useState("");
  const variantOptions = product.nuvemshopVariants?.length
    ? product.nuvemshopVariants
    : sizes.map((label) => ({ label, id: 0, price: product.price }));
  const selectedVariant =
    variantOptions.find((variant) => variant.label === size) ??
    variantOptions[0];
  const currentPrice = selectedVariant?.price ?? product.price;

  useEffect(() => {
    const preferred = product.nuvemshopVariants?.[0]?.label ?? "5x5 cm";
    setSize(preferred);
  }, [product.id, product.nuvemshopVariants]);
  const pickArtwork = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setArtworkName(result.assets[0].name);
  };
  const add = () => {
    addProduct(
      product,
      qty,
      size,
      artworkName,
      selectedVariant?.id || undefined,
      currentPrice,
    );
    Alert.alert("Produto adicionado", "O produto foi para o seu carrinho.", [
      { text: "Continuar comprando" },
      { text: "Ver carrinho", onPress: () => router.push("/(tabs)/carrinho") },
    ]);
  };
  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.breadcrumb}>
          <Text
            style={styles.breadcrumbBlue}
            onPress={() => router.push("/(tabs)")}
          >
            Início
          </Text>
          <Text style={styles.breadcrumbSep}>›</Text>
          <Text style={styles.breadcrumbText}>{product.name}</Text>
        </View>
        <View style={[styles.productLayout, isDesktop && styles.productLayoutDesktop]}>
        <View style={[styles.gallery, isDesktop && styles.galleryDesktop]}>
          <Image
            source={product.image}
            style={[styles.mainImage, isDesktop && styles.mainImageDesktop]}
            resizeMode="contain"
          />
          <View style={styles.thumbs}>
            <Image
              source={product.image}
              style={styles.thumb}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/products/product-2.png")}
              style={styles.thumb}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/products/product-3.png")}
              style={styles.thumb}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={[styles.info, isDesktop && styles.infoDesktop]}>
          <Text style={styles.eyebrow}>PRODUTO PERSONALIZADO</Text>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>{product.name}</Text>
          <View style={styles.rating}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.ratingText}> 4,9 (256 avaliações)</Text>
          </View>
          <Text style={styles.priceLabel}>A partir de</Text>
          <Text style={styles.price}>{formatBRL(currentPrice)}</Text>
          <Text style={styles.installment}>
            ou 3x de {formatBRL(currentPrice / 3)} sem juros
          </Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.divider} />
          <Text style={styles.optionTitle}>Tamanho</Text>
          <View style={styles.variants}>
            {variantOptions.map((variant) => (
              <Pressable
                key={`${variant.id}-${variant.label}`}
                onPress={() => setSize(variant.label)}
                style={[
                  styles.variant,
                  size === variant.label && styles.variantActive,
                ]}
              >
                <Text
                  style={[
                    styles.variantText,
                    size === variant.label && styles.variantTextActive,
                  ]}
                >
                  {variant.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.optionTitle}>Quantidade</Text>
          <View style={styles.quantity}>
            <Pressable
              onPress={() => setQty(Math.max(1, qty - 1))}
              style={styles.quantityButton}
            >
              <Text style={styles.quantitySymbol}>−</Text>
            </Pressable>
            <Text style={styles.quantityText}>
              {qty} pacote{qty > 1 ? "s" : ""}
            </Text>
            <Pressable
              onPress={() => setQty(qty + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantitySymbol}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.optionTitle}>
            Envie sua arte <Text style={styles.optional}>(opcional)</Text>
          </Text>
          <Pressable onPress={pickArtwork} style={styles.upload}>
            <Ionicons
              name="cloud-upload-outline"
              size={26}
              color={colors.blue}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.uploadTitle}>
                {artworkName || "Clique para enviar seu arquivo"}
              </Text>
              <Text style={styles.uploadText}>
                PNG, JPG, PDF ou AI · até 20 MB
              </Text>
            </View>
          </Pressable>
          <Text style={styles.optionTitle}>Calcule o frete e prazo</Text>
          <View style={styles.cepRow}>
            <TextInput
              value={cep}
              onChangeText={setCep}
              placeholder="Digite seu CEP"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              style={styles.cepInput}
            />
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Frete",
                  cep
                    ? "O cálculo será conectado ao serviço de entrega."
                    : "Digite seu CEP para calcular.",
                )
              }
            >
              <Text style={styles.calculate}>Calcular</Text>
            </Pressable>
          </View>
          <Pressable onPress={add} style={styles.addButton}>
            <Ionicons name="cart-outline" size={20} color={colors.white} />
            <Text style={styles.addText}>Adicionar ao carrinho</Text>
          </Pressable>
        </View>
        </View>
        <View style={[styles.benefits, isDesktop && styles.benefitsDesktop]}>
          <Benefit icon="shield-checkmark-outline" title="Materiais premium" />
          <Benefit icon="ribbon-outline" title="Impressão de alta definição" />
          <Benefit icon="headset-outline" title="Atendimento especializado" />
          <Benefit icon="lock-closed-outline" title="Compra 100% segura" />
        </View>
        <View style={[styles.related, isDesktop && styles.relatedDesktop]}>
          <Text style={styles.relatedTitle}>Você também pode gostar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScroll}
          >
            {products.slice(1, 5).map((item) => (
              <View key={item.id} style={[styles.relatedCard, isDesktop && styles.relatedCardDesktop]}>
                <ProductCard product={item} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

function Benefit({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.benefit}>
      <Ionicons name={icon} size={23} color={colors.ink} />
      <Text style={styles.benefitTitle}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: "100%", maxWidth: layout.maxWidth, alignSelf: "center", paddingBottom: 48 },
  breadcrumb: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    paddingBottom: 10,
  },
  breadcrumbBlue: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  breadcrumbSep: { color: colors.muted },
  breadcrumbText: { color: colors.text, fontSize: 12, flex: 1 },
  productLayout: { width: "100%" },
  productLayoutDesktop: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: spacing.lg, gap: spacing.xl },
  gallery: {
    marginHorizontal: spacing.md,
    backgroundColor: "#FCFCFD",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 8,
  },
  galleryDesktop: { flex: 1, marginHorizontal: 0, padding: spacing.md, borderRadius: 16 },
  mainImage: { width: "100%", height: 275 },
  mainImageDesktop: { height: 520 },
  thumbs: { flexDirection: "row", gap: 8 },
  thumb: {
    width: 59,
    height: 54,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  info: { padding: spacing.md, paddingTop: 22 },
  infoDesktop: { width: 440, padding: 0, paddingTop: 4 },
  eyebrow: {
    color: colors.blue,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
    marginTop: 8,
  },
  titleDesktop: { fontSize: 36, lineHeight: 42 },
  rating: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  stars: { color: colors.yellow, fontSize: 16, letterSpacing: 1 },
  ratingText: { color: colors.text, fontSize: 11 },
  priceLabel: { color: colors.text, fontSize: 12, marginTop: 18 },
  price: { color: colors.ink, fontSize: 27, fontWeight: "900" },
  installment: { color: colors.text, fontSize: 12 },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 17,
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 18 },
  optionTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 9,
  },
  variants: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 21,
  },
  variant: {
    minWidth: 72,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    alignItems: "center",
  },
  variantActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  variantText: { color: colors.text, fontSize: 11 },
  variantTextActive: { color: colors.blue, fontWeight: "800" },
  quantity: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    overflow: "hidden",
    marginBottom: 21,
  },
  quantityButton: {
    width: 39,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.soft,
  },
  quantitySymbol: { color: colors.ink, fontSize: 21 },
  quantityText: {
    paddingHorizontal: 18,
    color: colors.ink,
    fontWeight: "700",
    fontSize: 12,
  },
  optional: { color: colors.muted, fontWeight: "400" },
  upload: {
    minHeight: 74,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#BFC9D8",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 21,
  },
  uploadTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  uploadText: { color: colors.muted, fontSize: 10, marginTop: 3 },
  cepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 16,
  },
  cepInput: {
    height: 42,
    width: 150,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 11,
    color: colors.ink,
    fontSize: 13,
  },
  calculate: { color: colors.blue, fontWeight: "800", fontSize: 12 },
  addButton: {
    minHeight: 49,
    borderRadius: 6,
    backgroundColor: colors.blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addText: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "800",
    fontSize: 13,
  },
  benefits: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    gap: 14,
  },
  benefitsDesktop: { marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.lg, flexDirection: "row", justifyContent: "space-between" },
  benefit: { flexDirection: "row", alignItems: "center", gap: 11 },
  benefitTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  related: { padding: spacing.md, paddingTop: 24 },
  relatedDesktop: { paddingHorizontal: spacing.lg, paddingTop: 40 },
  relatedTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 11,
  },
  relatedScroll: { gap: 12 },
  relatedCard: { width: 260 },
  relatedCardDesktop: { width: 275 },
});
