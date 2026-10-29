import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useSession } from '@/store/session';

export function useAvatar() {
  const photo = useSession((state) => state.photo);
  const setPhoto = useSession((state) => state.setPhoto);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(from: 'library' | 'camera') {
    setPending(true);
    setError(null);
    try {
      const permission =
        from === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(from === 'camera' ? 'A câmera não foi autorizada.' : 'A galeria não foi autorizada.');
        return;
      }
      const result =
        from === 'camera'
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.4,
              base64: true,
              cameraType: ImagePicker.CameraType.front,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.4,
              base64: true,
            });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      await setPhoto(uri);
    } catch {
      setError('Não foi possível atualizar a foto.');
    } finally {
      setPending(false);
    }
  }

  return {
    photo,
    error,
    pending,
    fromLibrary: () => save('library'),
    fromCamera: () => save('camera'),
    remove: () => setPhoto(null),
  };
}
