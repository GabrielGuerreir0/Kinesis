import { useRouter, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Notice, VideoReview } from '@/components/VideoReview';
import { useSendVideo } from '@/hooks/useSendVideo';
import { useVideoPicker } from '@/hooks/useVideoPicker';
import { useThemedStyles } from '@/hooks/useColors';
import { cardStyle } from '@/theme/card';
import type { Palette } from '@/theme/colors';

export function VideoUpload() {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);
  const picker = useVideoPicker();
  const delivery = useSendVideo();

  async function submit() {
    if (!picker.clip) return;
    const sent = await delivery.send(picker.clip);
    if (sent) picker.clear();
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Enviar vídeo</Text>
      <Text style={styles.lead}>Vídeo curto de até 30 segundos e 20 MB. O envio fica neste aparelho.</Text>
      {picker.clip ? (
        <VideoReview
          clip={picker.clip}
          busy={delivery.busy}
          notice={delivery.notice}
          onSend={() => void submit()}
          onDiscard={() => {
            picker.clear();
            delivery.clearNotice();
          }}
        />
      ) : (
        <Button label="Escolher vídeo" onPress={() => void picker.pick()} />
      )}
      {picker.error ? <Text style={styles.err}>{picker.error}</Text> : null}
      {!picker.clip && delivery.notice ? <Notice notice={delivery.notice} /> : null}
      <Button label="Gravar vídeo" tone="ghost" onPress={() => router.push('/gravar' as Href)} />
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: { ...cardStyle(colors), padding: 16, gap: 12 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  lead: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  err: { color: colors.danger, fontSize: 14, fontWeight: '600' },
  });
