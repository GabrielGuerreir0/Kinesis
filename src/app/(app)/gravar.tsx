import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { Button } from '@/components/Button';
import { Notice, VideoReview } from '@/components/VideoReview';
import { Screen } from '@/components/Screen';
import { useSendVideo } from '@/hooks/useSendVideo';
import { useVideoPicker } from '@/hooks/useVideoPicker';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function RecordScreen() {
  const focused = useIsFocused();
  const styles = useThemedStyles(makeStyles);
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const recorder = useVideoRecorder(camera);
  const webCapture = useVideoPicker();
  const delivery = useSendVideo();
  const native = Platform.OS !== 'web';
  const clip = native ? recorder.clip : webCapture.clip;
  const granted = permission?.granted === true;
  const showCamera = native && granted && focused && !clip;

  useEffect(() => {
    return () => {
      camera.current?.stopRecording();
    };
  }, []);

  async function submit() {
    if (!clip) return;
    const sent = await delivery.send(clip);
    if (!sent) return;
    recorder.clear();
    webCapture.clear();
  }

  function discard() {
    recorder.clear();
    webCapture.clear();
    delivery.clearNotice();
  }

  return (
    <Screen>
      <Text style={styles.lead}>Grave até 30 segundos. O arquivo pode ter no máximo 20 MB. Depois, aprove o envio.</Text>
      {!native && !clip ? (
        <Button label="Gravar vídeo" onPress={() => void webCapture.pick('camera')} />
      ) : null}
      {native && permission && !granted ? (
        <Button
          label={permission.canAskAgain ? 'Permitir câmera' : 'Câmera bloqueada nos ajustes'}
          disabled={!permission.canAskAgain}
          onPress={() => void requestPermission()}
        />
      ) : null}
      {showCamera ? (
        <CameraView
          ref={camera}
          style={styles.preview}
          facing="back"
          mode="video"
          mute
          onCameraReady={() => setReady(true)}
          onRecordingProgress={recorder.onProgress}
        />
      ) : null}
      {showCamera ? (
        <Button
          label={recorder.recording ? `Parar · ${Math.round(recorder.elapsed)}s` : 'Gravar'}
          disabled={!ready && !recorder.recording}
          onPress={() => (recorder.recording ? recorder.stop() : void recorder.start())}
        />
      ) : null}
      {recorder.error || webCapture.error ? <Text style={styles.err}>{recorder.error ?? webCapture.error}</Text> : null}
      {clip ? (
        <VideoReview clip={clip} busy={delivery.busy} notice={delivery.notice} onSend={() => void submit()} onDiscard={discard} />
      ) : null}
      {!clip && delivery.notice ? <Notice notice={delivery.notice} /> : null}
      {!showCamera && !clip ? <View style={styles.spacer} /> : null}
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  lead: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  preview: { flex: 1, minHeight: 320, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.text },
  err: { color: colors.danger, fontSize: 14, fontWeight: '600' },
  spacer: { flex: 1 },
  });
