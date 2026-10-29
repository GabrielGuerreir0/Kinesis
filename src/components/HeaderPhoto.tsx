import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { ProfilePhoto } from '@/components/ProfilePhoto';
import { useMenu } from '@/components/MenuContext';
import { useColors } from '@/hooks/useColors';
import { useSession } from '@/store/session';

export function HeaderPhoto() {
  const router = useRouter();
  const { closeMenu } = useMenu();
  const colors = useColors();
  const name = useSession((state) => state.profile.name);
  const photo = useSession((state) => state.photo);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Editar perfil"
      onPress={() => {
        closeMenu();
        router.push('/perfil' as Href);
      }}
      style={styles.hit}
    >
      <View style={[styles.ring, { borderColor: colors.ink }]}>
        <ProfilePhoto name={name} photo={photo} size={32} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { marginLeft: 12, padding: 4 },
  ring: { borderWidth: 2, borderRadius: 18 },
});
