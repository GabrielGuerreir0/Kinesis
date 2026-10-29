import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'accent' | 'ghost' | 'danger';
};

export function Button({ label, onPress, disabled, tone = 'accent' }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        tone === 'accent' && styles.accent,
        tone === 'ghost' && styles.ghost,
        tone === 'danger' && styles.danger,
        (pressed || disabled) && styles.dim,
      ]}
    >
      <Text style={[styles.label, tone === 'accent' ? styles.onAccent : tone === 'ghost' ? styles.onGhost : styles.onSoft]}>
        {label}
      </Text>
    </Pressable>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    base: { borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    accent: { backgroundColor: colors.accent },
    ghost: { backgroundColor: colors.surface, borderColor: colors.accent, borderWidth: 1 },
    danger: { backgroundColor: colors.surface2 },
    dim: { opacity: 0.6 },
    label: { fontSize: 16, fontWeight: '700' },
    onAccent: { color: colors.ink },
    onGhost: { color: colors.accent },
    onSoft: { color: colors.text },
  });
