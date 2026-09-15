import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const hideWebTabBar = Platform.OS === 'web' && width >= 700;

  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.blue, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 11, fontWeight: '700' }, tabBarStyle: hideWebTabBar ? { display: 'none' } : { height: 66, paddingBottom: 8, paddingTop: 6 } }}>
    <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="catalogo" options={{ title: 'Catálogo', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="carrinho" options={{ title: 'Carrinho', tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="contato" options={{ title: 'Contato', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} /> }} />
  </Tabs>;
}
