import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon, type IconName } from '@/components/AppIcon';
import { useColors, useThemedStyles } from '@/hooks/useColors';
import { cardStyle } from '@/theme/card';
import type { Palette } from '@/theme/colors';

type Props = { icon: IconName; title: string; detail: string; onPress: () => void };

export function NavRow({ icon, title, detail, onPress }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.badge}>
        <AppIcon name={icon} color={colors.accent} size={20} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <AppIcon name="chevron" color={colors.muted} size={20} />
    </Pressable>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { ...cardStyle(colors), padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
    badge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: { flex: 1, gap: 2 },
    title: { color: colors.text, fontSize: 16, fontWeight: '600' },
    detail: { color: colors.muted, fontSize: 13 },
  });
