import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { CartProvider } from "../src/context/CartContext";
import { ProductCatalogProvider } from "../src/context/ProductCatalogContext";
import { NuvemshopFrameResize } from "../src/components/NuvemshopFrameResize";

export default function RootLayout() {
  return (
    <ProductCatalogProvider>
      <CartProvider>
        <NuvemshopFrameResize />
        <StatusBar style="dark" />
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
      </CartProvider>
    </ProductCatalogProvider>
  );
}
