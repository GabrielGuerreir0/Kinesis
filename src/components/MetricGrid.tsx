import { StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import { cardStyle } from '@/theme/card';
import type { Palette } from '@/theme/colors';

type Item = { label: string; value: string };

export function MetricGrid({ items }: { items: Item[] }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: {
      ...cardStyle(colors),
      flexGrow: 1,
      flexBasis: '46%',
      padding: 14,
      gap: 4,
    },
    label: { color: colors.muted, fontSize: 13 },
    value: { color: colors.text, fontSize: 22, fontWeight: '700' },
  });
