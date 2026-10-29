import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ visible, title, message, confirmLabel, onCancel, onConfirm }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancel}>
              <Text style={styles.cancelLabel}>Cancelar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.confirm}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(17,17,17,0.45)', justifyContent: 'center', padding: 28 },
    card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, gap: 12 },
    title: { color: colors.text, fontSize: 20, fontWeight: '700' },
    message: { color: colors.muted, fontSize: 15, lineHeight: 22 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
    cancel: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
    cancelLabel: { color: colors.muted, fontSize: 16, fontWeight: '700' },
    confirm: { backgroundColor: colors.accent, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
    confirmLabel: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  });
