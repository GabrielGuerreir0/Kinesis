import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readBytes, readWebDuration, VIDEO_MAX_BYTES, VIDEO_MAX_SECONDS, type VideoClip } from '@/video/limits';

const KEY = 'kinesis.video.last';

export type SendNotice = { ok: boolean; text: string; detail?: string };

export function useSendVideo() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<SendNotice | null>(null);

  function clearNotice() {
    setNotice(null);
  }

  async function send(clip: VideoClip): Promise<boolean> {
    setBusy(true);
    setNotice(null);
    try {
      const seconds = clip.seconds ?? (await readWebDuration(clip.uri));
      const bytes = clip.bytes ?? (await readBytes(clip.uri));
      if (seconds != null && seconds > VIDEO_MAX_SECONDS + 0.5) {
        setNotice({ ok: false, text: 'Erro ao enviar', detail: 'O vídeo passa de 30 segundos.' });
        return false;
      }
      if (seconds == null || seconds <= 0 || bytes == null || bytes <= 0) {
        setNotice({ ok: false, text: 'Erro ao enviar' });
        return false;
      }
      if (bytes > VIDEO_MAX_BYTES) {
        setNotice({ ok: false, text: 'Erro ao enviar', detail: 'O vídeo passa de 20 MB.' });
        return false;
      }
      await AsyncStorage.setItem(
        KEY,
        JSON.stringify({ name: clip.name, seconds, bytes, sentAt: new Date().toISOString() }),
      );
      setNotice({ ok: true, text: 'Enviado com sucesso' });
      return true;
    } catch {
      setNotice({ ok: false, text: 'Erro ao enviar' });
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { busy, notice, send, clearNotice };
}
