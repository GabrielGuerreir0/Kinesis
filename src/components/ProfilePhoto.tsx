import { Image, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export function ProfilePhoto({ name, photo, size = 88 }: { name: string; photo: string | null; size?: number }) {
  const styles = useThemedStyles(makeStyles);
  const letter = name.trim().charAt(0).toUpperCase() || 'K';
  if (photo) {
    return <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.letter, { fontSize: size * 0.38 }]}>{letter}</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    fallback: { backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
    letter: { color: colors.accent, fontWeight: '700' },
  });
