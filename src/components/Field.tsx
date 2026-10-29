import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColors, useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

type Props = TextInputProps & { label: string };

export function Field({ label, style, ...props }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" style={[styles.input, style]} {...props} />
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    wrap: { gap: 8 },
    label: { color: colors.muted, fontSize: 13 },
    input: {
      backgroundColor: colors.surface2,
      borderRadius: 12,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
  });
