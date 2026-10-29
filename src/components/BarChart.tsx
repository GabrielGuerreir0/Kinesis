import { StyleSheet, Text, View } from 'react-native';
import type { Bar } from '@/data/wearables';
import { useColors, useThemedStyles } from '@/hooks/useColors';
import { cardStyle } from '@/theme/card';
import type { Palette } from '@/theme/colors';

const CHART_HEIGHT = 112;

function format(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
}

export function BarChart({
  title,
  unit,
  bars,
  tone = 'sleep',
}: {
  title: string;
  unit: string;
  bars: Bar[];
  tone?: 'sleep' | 'rest';
}) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const max = Math.max(...bars.map((bar) => bar.value));
  const fill = tone === 'rest' ? colors.rest : colors.accent;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.unit}>{unit}</Text>
      <View style={styles.row}>
        {bars.map((bar) => (
          <View key={bar.label} style={styles.col}>
            <Text style={styles.value}>{format(bar.value)}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { backgroundColor: fill, height: Math.max(8, (bar.value / max) * CHART_HEIGHT) }]} />
            </View>
            <Text style={styles.label}>{bar.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      ...cardStyle(colors),
      padding: 16,
      gap: 8,
    },
    title: { color: colors.text, fontSize: 16, fontWeight: '700' },
    unit: { color: colors.muted, fontSize: 12, marginTop: -4 },
    row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 8 },
    col: { flex: 1, alignItems: 'center', gap: 6 },
    value: { color: colors.muted, fontSize: 10 },
    track: { height: CHART_HEIGHT, width: '100%', justifyContent: 'flex-end' },
    fill: { borderRadius: 8, width: '100%' },
    label: { color: colors.muted, fontSize: 11 },
  });
