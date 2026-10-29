import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, type IconName } from '@/components/AppIcon';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useColors, useThemedStyles } from '@/hooks/useColors';
import { useSession } from '@/store/session';
import type { Palette } from '@/theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLeave: () => void;
};

export function BottomMenu({ visible, onClose, onLeave }: Props) {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const profile = useSession((state) => state.profile);
  const styles = useThemedStyles(makeStyles);
  const sheet = useBottomSheet(visible);

  function go(href: Href) {
    onClose();
    router.navigate(href);
  }

  if (!sheet.shown) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: sheet.backdrop }]}>
        <Pressable accessibilityLabel="Fechar menu" style={styles.fill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { height: sheet.sheetHeight, transform: [{ translateY: sheet.translateY }] }]}>
        <View style={styles.handle} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <MenuRow icon="home" label="Painel" active={path === '/'} onPress={() => go('/')} />
        <MenuRow icon="video" label="Gravar vídeo" active={path === '/gravar'} onPress={() => go('/gravar' as Href)} />
        <View style={styles.grow} />
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <MenuRow
            icon="settings"
            label="Configurações"
            active={path.startsWith('/configuracoes')}
            onPress={() => go('/configuracoes' as Href)}
          />
          <MenuRow
            icon="logout"
            label="Sair"
            onPress={() => {
              onClose();
              onLeave();
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

function MenuRow({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress: () => void }) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const color = active ? colors.accent : colors.text;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, active && styles.rowOn]}>
      <View style={styles.badge}>
        <AppIcon name={icon} color={colors.accent} size={20} />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 30, justifyContent: 'flex-end' },
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: '#000000' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  handle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: 16 },
  name: { color: colors.text, fontSize: 22, fontWeight: '700', paddingHorizontal: 8 },
  email: { color: colors.muted, fontSize: 14, paddingHorizontal: 8, marginBottom: 16 },
  grow: { flex: 1 },
  footer: { borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, paddingVertical: 12, borderRadius: 16 },
  rowOn: { backgroundColor: colors.accentSoft },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '700' },
  });
