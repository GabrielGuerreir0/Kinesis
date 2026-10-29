import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  footer?: boolean;
};

export function Screen({ children, scroll, footer }: Props) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const paddingBottom = (footer ? 24 : insets.bottom) + 24;
  if (scroll) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingBottom }]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.root, styles.content, { paddingBottom }]}>{children}</View>;
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  });
