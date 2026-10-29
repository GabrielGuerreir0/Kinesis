import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import type { SendNotice } from '@/hooks/useSendVideo';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';
import { formatBytes, formatSeconds, type VideoClip } from '@/video/limits';

type Props = {
  clip: VideoClip;
  busy: boolean;
  notice: SendNotice | null;
  onSend: () => void;
  onDiscard: () => void;
};

export function VideoReview({ clip, busy, notice, onSend, onDiscard }: Props) {
  const styles = useThemedStyles(makeStyles);
  const seconds = clip.seconds == null ? 'duração a confirmar' : formatSeconds(clip.seconds);
  const size = clip.bytes == null ? 'tamanho a confirmar' : formatBytes(clip.bytes);

  return (
    <View style={styles.box}>
      <Text style={styles.name} numberOfLines={1}>
        {clip.name}
      </Text>
      <Text style={styles.meta}>
        {seconds} · {size}
      </Text>
      <Button label={busy ? 'Enviando…' : 'Enviar'} disabled={busy} onPress={onSend} />
      <Button label="Descartar" tone="ghost" disabled={busy} onPress={onDiscard} />
      {notice ? <Notice notice={notice} /> : null}
    </View>
  );
}

export function Notice({ notice }: { notice: SendNotice }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.notice}>
      <Text style={[styles.result, notice.ok ? styles.ok : styles.err]}>{notice.text}</Text>
      {notice.detail ? <Text style={styles.detail}>{notice.detail}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  box: { gap: 12 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 14 },
  notice: { gap: 4 },
  result: { fontSize: 16, fontWeight: '700' },
  ok: { color: colors.accent },
  err: { color: colors.danger },
  detail: { color: colors.muted, fontSize: 14 },
  });
