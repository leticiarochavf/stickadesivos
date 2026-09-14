import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SiteHeader } from "../src/components/SiteHeader";
import { formatBRL } from "../src/components/ProductCard";
import { useCart } from "../src/context/CartContext";
import {
  isNuvemshopProduct,
  openNuvemshopCart,
} from "../src/integrations/nuvemshopBridge";
import { colors, spacing } from "../src/theme";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total } = useCart();

  const continueToCheckout = () => {
    if (!items.length) {
      router.replace("/(tabs)/catalogo");
      return;
    }
    if (items.some((item) => !isNuvemshopProduct(item.product))) {
      Alert.alert(
        "Catálogo de demonstração",
        "Para pagar, conecte os produtos reais da Nuvemshop nas variáveis de ambiente da API.",
      );
      return;
    }
    if (!openNuvemshopCart()) {
      Alert.alert(
        "Abra pela loja oficial",
        "O checkout seguro fica disponível quando este site é aberto dentro da loja Stick Adesivos na Nuvemshop.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Voltar ao carrinho</Text>
        </Pressable>
        <Text style={styles.title}>
          Pagamento <Text style={styles.pink}>seguro</Text>
        </Text>
        <Text style={styles.subtitle}>
          Você continuará no checkout oficial da Nuvemshop, com o Nuvem Pago.
        </Text>

        <View style={styles.securityCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color={colors.success}
          />
          <View style={styles.securityCopy}>
            <Text style={styles.securityTitle}>
              Seus dados ficam protegidos
            </Text>
            <Text style={styles.securityText}>
              Endereço, entrega e pagamento são preenchidos diretamente no
              ambiente seguro da Nuvemshop.
            </Text>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Resumo do pedido</Text>
          <View style={styles.line}>
            <Text style={styles.label}>Itens</Text>
            <Text style={styles.value}>
              {items.reduce((sum, item) => sum + item.qty, 0)}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatBRL(total)}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Frete</Text>
            <Text style={styles.value}>Calculado no checkout</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.line}>
            <Text style={styles.total}>Total parcial</Text>
            <Text style={styles.totalValue}>{formatBRL(total)}</Text>
          </View>
          <Pressable style={styles.primary} onPress={continueToCheckout}>
            <Ionicons
              name="lock-closed-outline"
              size={17}
              color={colors.white}
            />
            <Text style={styles.primaryText}>Ir para pagamento</Text>
          </Pressable>
          <Text style={styles.note}>
            PIX, cartão e demais opções aparecem conforme a configuração ativa
            do Nuvem Pago.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.md, paddingBottom: 35 },
  back: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 16,
  },
  title: { color: colors.ink, fontSize: 29, fontWeight: "900" },
  pink: { color: colors.pink },
  subtitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },
  securityCard: {
    borderWidth: 1,
    borderColor: "#CFE6D7",
    backgroundColor: "#F6FCF8",
    borderRadius: 10,
    padding: spacing.md,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  securityCopy: { flex: 1 },
  securityTitle: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  securityText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  summary: {
    marginTop: 16,
    borderRadius: 10,
    padding: spacing.md,
    backgroundColor: colors.blueSoft,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 15,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 15,
  },
  label: { color: colors.text, fontSize: 13 },
  value: { color: colors.text, fontSize: 13, textAlign: "right" },
  divider: { height: 1, backgroundColor: "#D5E1F2", marginVertical: 4 },
  total: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  totalValue: { color: colors.blue, fontSize: 20, fontWeight: "900" },
  primary: {
    backgroundColor: colors.blue,
    minHeight: 48,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    flexDirection: "row",
    gap: 8,
  },
  primaryText: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "800",
    fontSize: 12,
  },
  note: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 10,
  },
});
