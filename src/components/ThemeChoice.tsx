import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import { useTheme, type ThemePreference } from '@/store/theme';
import type { Palette } from '@/theme/colors';

const options: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'Sistema' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
];

export function ThemeChoice() {
  const preference = useTheme((state) => state.preference);
  const setPreference = useTheme((state) => state.setPreference);
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Aparência</Text>
      <Text style={styles.lead}>Use o tema do aparelho ou escolha claro ou escuro.</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = preference === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => void setPreference(option.id)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    box: { gap: 8 },
    title: { color: colors.text, fontSize: 18, fontWeight: '700' },
    lead: { color: colors.muted, fontSize: 15, lineHeight: 22 },
    row: { flexDirection: 'row', gap: 8, marginTop: 4 },
    chip: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: 'center',
    },
    chipOn: { backgroundColor: colors.accent },
    chipLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },
    chipLabelOn: { color: colors.ink },
  });
