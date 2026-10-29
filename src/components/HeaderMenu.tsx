import { Pressable, StyleSheet } from 'react-native';
import { AppIcon } from '@/components/AppIcon';
import { useMenu } from '@/components/MenuContext';
import { useColors } from '@/hooks/useColors';

export function HeaderMenu() {
  const { openMenu } = useMenu();
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Abrir menu" onPress={openMenu} style={styles.hit}>
      <AppIcon name="menu" color={colors.ink} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { marginRight: 12, padding: 8 },
});
