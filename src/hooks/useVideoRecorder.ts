import { useRef, useState, type RefObject } from 'react';
import type { CameraView } from 'expo-camera';
import { readBytes, VIDEO_MAX_BYTES, VIDEO_MAX_SECONDS, type VideoClip } from '@/video/limits';

export function useVideoRecorder(camera: RefObject<CameraView | null>) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState<VideoClip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const progress = useRef({ seconds: 0, bytes: 0 });

  function onProgress(event: { duration: number; fileSize: number }) {
    progress.current = { seconds: event.duration, bytes: event.fileSize };
    setElapsed(Math.min(VIDEO_MAX_SECONDS, event.duration));
  }

  async function start() {
    const view = camera.current;
    if (!view || lock.current) return;
    lock.current = true;
    setError(null);
    setClip(null);
    setElapsed(0);
    progress.current = { seconds: 0, bytes: 0 };
    setRecording(true);
    const started = Date.now();
    const tick = setInterval(() => {
      setElapsed(Math.min(VIDEO_MAX_SECONDS, (Date.now() - started) / 1000));
    }, 200);
    try {
      const result = await view.recordAsync({
        maxDuration: VIDEO_MAX_SECONDS,
        maxFileSize: VIDEO_MAX_BYTES,
      });
      const uri = result?.uri;
      if (!uri) {
        setError('A gravação não gerou um vídeo.');
        return;
      }
      const seconds = progress.current.seconds || (Date.now() - started) / 1000;
      const bytes = progress.current.bytes > 0 ? progress.current.bytes : await readBytes(uri);
      setClip({ uri, name: 'gravacao.mp4', seconds, bytes });
    } catch {
      setError('Não foi possível gravar o vídeo.');
    } finally {
      clearInterval(tick);
      lock.current = false;
      setRecording(false);
    }
  }

  function stop() {
    camera.current?.stopRecording();
  }

  function clear() {
    setClip(null);
    setElapsed(0);
    setError(null);
  }

  return { recording, elapsed, clip, error, onProgress, start, stop, clear };
}
