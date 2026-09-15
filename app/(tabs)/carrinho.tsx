import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SiteHeader } from "../../src/components/SiteHeader";
import { formatBRL } from "../../src/components/ProductCard";
import { useCart } from "../../src/context/CartContext";
import { irParaCheckout } from "../../src/integrations/nuvemshopCheckout";
import { colors, layout, spacing } from "../../src/theme";

export default function CartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const { items, total, updateQty, removeItem } = useCart();
  const [erro, setErro] = React.useState("");

  /*
   * O pagamento acontece no checkout da loja Nuvemshop, que já
   * recebe os itens pelo endereço do carrinho. Aqui no site não
   * passa nenhum dado de cartão.
   */
  const pagar = async () => {
    setErro("");
    const resultado = await irParaCheckout(items);

    if (!resultado.ok) {
      setErro(
        resultado.motivo === "carrinho-vazio"
          ? "Seu carrinho está vazio."
          : `O produto "${resultado.itemSemVariante}" ainda não está ligado à loja. Fale com a gente pelo WhatsApp para fechar este pedido.`,
      );
    }
  };
  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
          Meu <Text style={styles.pink}>carrinho</Text>
        </Text>
        {!items.length ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.emptyText}>
              Escolha um adesivo para começar seu pedido.
            </Text>
            <Pressable
              style={styles.primary}
              onPress={() => router.push("/(tabs)/catalogo")}
            >
              <Text style={styles.primaryText}>Ver catálogo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.cartLayout, isDesktop && styles.cartLayoutDesktop]}>
            <View style={[styles.items, isDesktop && styles.itemsDesktop]}>
              {items.map((item) => (
                <View key={item.key} style={styles.item}>
                  <Image
                    source={item.product.image}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemMeta}>
                      {item.variant} · {item.product.material}
                    </Text>
                    <Text style={styles.itemPrice}>
                    {formatBRL(item.unitPrice ?? item.product.price)}
                    </Text>
                    <View style={styles.quantity}>
                      <Pressable
                        onPress={() => updateQty(item.key, item.qty - 1)}
                        style={styles.quantityButton}
                      >
                        <Text>−</Text>
                      </Pressable>
                      <Text style={styles.quantityText}>{item.qty}</Text>
                      <Pressable
                        onPress={() => updateQty(item.key, item.qty + 1)}
                        style={styles.quantityButton}
                      >
                        <Text>+</Text>
                      </Pressable>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => removeItem(item.key)}
                    style={styles.remove}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
            <View style={[styles.summary, isDesktop && styles.summaryDesktop]}>
              <Text style={styles.summaryTitle}>Resumo do pedido</Text>
              <View style={styles.line}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>{formatBRL(total)}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.label}>Frete</Text>
                <Text style={styles.value}>Calculado na finalização</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.line}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatBRL(total)}</Text>
              </View>

              {erro ? <Text style={styles.erro}>{erro}</Text> : null}

              <Pressable style={styles.primary} onPress={pagar}>
                <Text style={styles.primaryText}>Finalizar e pagar</Text>
                <Ionicons name="arrow-forward" size={17} color={colors.white} />
              </Pressable>

              <Text style={styles.nota}>
                O pagamento é concluído no ambiente seguro da loja, com Pix,
                boleto ou cartão. Seus itens vão junto.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  erro: {
    marginTop: 12,
    padding: 11,
    borderRadius: 7,
    backgroundColor: '#FDECEF',
    color: '#A01035',
    fontSize: 13,
    lineHeight: 19,
  },
  nota: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  screen: { flex: 1, backgroundColor: colors.white },
  content: { width: "100%", maxWidth: layout.maxWidth, alignSelf: "center", padding: spacing.md, paddingBottom: 48 },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  titleDesktop: { fontSize: 36, marginTop: spacing.md, marginBottom: spacing.lg },
  pink: { color: colors.pink },
  empty: {
    backgroundColor: colors.soft,
    borderRadius: 10,
    alignItems: "center",
    padding: 34,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 18,
  },
  items: { gap: 10 },
  itemsDesktop: { flex: 1 },
  cartLayout: { width: "100%" },
  cartLayoutDesktop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xl },
  item: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    padding: 10,
    flexDirection: "row",
    position: "relative",
  },
  itemImage: {
    width: 105,
    height: 105,
    backgroundColor: "#FCFCFD",
    borderRadius: 7,
  },
  itemInfo: { flex: 1, paddingLeft: 11, paddingRight: 24 },
  itemName: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 18,
  },
  itemMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  itemPrice: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 16,
    marginTop: 6,
  },
  remove: { position: "absolute", top: 10, right: 10 },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 5,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  quantityButton: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.soft,
  },
  quantityText: {
    width: 30,
    textAlign: "center",
    color: colors.ink,
    fontWeight: "700",
  },
  summary: {
    marginTop: 20,
    padding: spacing.md,
    backgroundColor: colors.blueSoft,
    borderRadius: 10,
  },
  summaryDesktop: { width: 380, marginTop: 0 },
  summaryTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 14,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },
  label: { color: colors.text, fontSize: 13 },
  value: {
    color: colors.text,
    fontSize: 13,
    textAlign: "right",
    maxWidth: 180,
  },
  divider: { height: 1, backgroundColor: "#D6E1F3", marginVertical: 6 },
  totalLabel: { color: colors.ink, fontWeight: "900", fontSize: 16 },
  totalValue: { color: colors.blue, fontWeight: "900", fontSize: 20 },
  primary: {
    minHeight: 45,
    marginTop: 14,
    borderRadius: 6,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 15,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
