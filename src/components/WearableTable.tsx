import { StyleSheet, Text, View } from 'react-native';
import type { Wearable, WearableStatus } from '@/data/wearables';
import { useThemedStyles } from '@/hooks/useColors';
import { cardStyle } from '@/theme/card';
import type { Palette } from '@/theme/colors';

const STATUS: Record<WearableStatus, string> = {
  conectado: 'Conectado',
  espera: 'Em espera',
  bateria: 'Bateria baixa',
};

export function WearableTable({ rows }: { rows: Wearable[] }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dispositivos</Text>
      <View style={styles.head}>
        <Text style={[styles.cell, styles.name]}>Nome</Text>
        <Text style={[styles.cell, styles.kind]}>Tipo</Text>
        <Text style={[styles.cell, styles.battery]}>Carga</Text>
        <Text style={[styles.cell, styles.state]}>Estado</Text>
      </View>
      {rows.map((row) => (
        <View key={row.id} style={styles.line}>
          <View style={styles.name}>
            <Text style={styles.device}>{row.name}</Text>
            <Text style={styles.signal}>{row.signal}</Text>
          </View>
          <Text style={[styles.cell, styles.kind]}>{row.kind}</Text>
          <Text style={[styles.cell, styles.battery]}>{row.battery}%</Text>
          <Text style={[styles.cell, styles.state, row.status === 'bateria' && styles.warn]}>{STATUS[row.status]}</Text>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      ...cardStyle(colors),
      padding: 16,
      gap: 12,
    },
    title: { color: colors.text, fontSize: 16, fontWeight: '700' },
    head: { flexDirection: 'row', gap: 8 },
    line: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderTopColor: colors.line,
      borderTopWidth: 1,
      paddingTop: 10,
    },
    cell: { color: colors.muted, fontSize: 12 },
    name: { flex: 1.4 },
    kind: { flex: 0.9 },
    battery: { flex: 0.7 },
    state: { flex: 1.1 },
    device: { color: colors.text, fontSize: 14, fontWeight: '600' },
    signal: { color: colors.muted, fontSize: 11 },
    warn: { color: colors.danger },
  });
