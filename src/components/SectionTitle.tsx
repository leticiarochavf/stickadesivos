import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return <View style={styles.row}><Text style={styles.title}>{children}</Text>{action ? <Text style={styles.action}>{action}</Text> : null}</View>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 8, marginBottom: 12 }, title: { fontSize: 20, color: colors.ink, fontWeight: '900' }, action: { color: colors.blue, fontSize: 12, fontWeight: '800' } });
