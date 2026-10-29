import { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { toSeconds, VIDEO_MAX_BYTES, VIDEO_MAX_SECONDS, type VideoClip } from '@/video/limits';

export function useVideoPicker() {
  const [clip, setClip] = useState<VideoClip | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(from: 'library' | 'camera' = 'library') {
    setError(null);
    const permission =
      from === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(from === 'camera' ? 'A câmera não foi autorizada.' : 'A galeria não foi autorizada.');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['videos'], videoMaxDuration: VIDEO_MAX_SECONDS };
    const result =
      from === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    if (asset.type && asset.type !== 'video') {
      setError('Escolha um vídeo.');
      return;
    }
    const seconds = toSeconds(asset.duration, Platform.OS !== 'web');
    if (seconds != null && seconds > VIDEO_MAX_SECONDS + 0.5) {
      setClip(null);
      setError('O vídeo passa de 30 segundos.');
      return;
    }
    if (asset.fileSize != null && asset.fileSize > VIDEO_MAX_BYTES) {
      setClip(null);
      setError('O vídeo passa de 20 MB.');
      return;
    }
    setClip({
      uri: asset.uri,
      name: asset.fileName ?? 'video.mp4',
      seconds,
      bytes: asset.fileSize ?? null,
    });
  }

  function clear() {
    setClip(null);
  }

  return { clip, error, pick, clear };
}
