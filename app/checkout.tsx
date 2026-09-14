import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SiteHeader } from "../src/components/SiteHeader";
import { useCart } from "../src/context/CartContext";
import { irParaCheckout } from "../src/integrations/nuvemshopCheckout";
import { colors, spacing } from "../src/theme";

/*
 * Esta tela deixou de coletar dados de pagamento.
 *
 * O pagamento é concluído no checkout da loja Nuvemshop, que é
 * quem trata endereço, frete, Pix, boleto e cartão. Pedir esses
 * dados aqui seria digitação repetida e guardaria informação
 * sensível sem necessidade.
 *
 * A rota continua existindo para não quebrar link antigo: ela
 * apenas leva a pessoa para a finalização.
 */

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total } = useCart();
  const [erro, setErro] = useState("");

  const finalizar = async () => {
    setErro("");
    const resultado = await irParaCheckout(items);

    if (!resultado.ok) {
      setErro(
        resultado.motivo === "carrinho-vazio"
          ? "Seu carrinho está vazio."
          : `O produto "${resultado.itemSemVariante}" ainda não está ligado à loja. Fale com a gente pelo WhatsApp.`,
      );
    }
  };

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Finalizar pedido</Text>

        <Text style={styles.lead}>
          O pagamento é concluído no ambiente seguro da loja, com Pix, boleto ou
          cartão. Os itens do seu carrinho vão junto, e o endereço e o frete são
          informados lá.
        </Text>

        <View style={styles.box}>
          <View style={styles.line}>
            <Text style={styles.label}>Itens</Text>
            <Text style={styles.value}>{items.length}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Pressable style={styles.primary} onPress={finalizar}>
          <Text style={styles.primaryText}>Ir para o pagamento</Text>
        </Pressable>

        <Pressable
          style={styles.ghost}
          onPress={() => router.push("/(tabs)/carrinho")}
        >
          <Text style={styles.ghostText}>Voltar ao carrinho</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.md, paddingBottom: 40, gap: 14 },
  title: { color: colors.ink, fontSize: 26, fontWeight: "900" },
  lead: { color: colors.text, fontSize: 14, lineHeight: 21 },
  box: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: spacing.md,
    gap: 8,
  },
  line: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: colors.muted, fontSize: 13 },
  value: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  erro: {
    padding: 11,
    borderRadius: 7,
    backgroundColor: "#FDECEF",
    color: "#A01035",
    fontSize: 13,
    lineHeight: 19,
  },
  primary: {
    backgroundColor: colors.blue,
    minHeight: 48,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
  },
  ghost: {
    minHeight: 44,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: colors.blue, fontWeight: "800", fontSize: 13 },
});
