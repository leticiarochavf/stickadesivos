import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, layout } from '../theme';

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  return <View style={styles.row}><Text style={[styles.title, isDesktop && styles.titleDesktop]}>{children}</Text>{action ? <Text style={styles.action}>{action}</Text> : null}</View>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 10, marginBottom: 16 }, title: { fontSize: 21, color: colors.ink, fontWeight: '900' }, titleDesktop: { fontSize: 29 }, action: { color: colors.blue, fontSize: 13, fontWeight: '800' } });
