import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return <CartProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} /></CartProvider>;
}
