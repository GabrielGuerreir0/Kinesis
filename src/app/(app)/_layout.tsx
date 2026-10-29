import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { BottomMenu } from '@/components/BottomMenu';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { HeaderMenu } from '@/components/HeaderMenu';
import { HeaderPhoto } from '@/components/HeaderPhoto';
import { MenuProvider } from '@/components/MenuContext';
import { useSession } from '@/store/session';
import { useColors } from '@/hooks/useColors';

const mainHeader = {
  title: '',
  headerLeft: () => <HeaderPhoto />,
  headerRight: () => <HeaderMenu />,
};

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const signOut = useSession((state) => state.signOut);
  const colors = useColors();
  const menu = useMemo(() => ({ openMenu: () => setOpen(true), closeMenu: () => setOpen(false) }), []);

  return (
    <MenuProvider value={menu}>
      <View style={styles.root}>
        <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.accent },
          headerTintColor: colors.ink,
          headerTitleStyle: { color: colors.ink, fontWeight: '700' },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ ...mainHeader, title: 'Painel' }} />
        <Stack.Screen name="gravar" options={{ ...mainHeader, title: 'Gravar vídeo' }} />
        <Stack.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
          }}
        />
        <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
      </Stack>
      <BottomMenu
        visible={open}
        onClose={() => setOpen(false)}
        onLeave={() => {
          setOpen(false);
          setLeaving(true);
        }}
      />
      </View>
      <ConfirmDialog
        visible={leaving}
        title="Sair da conta?"
        message="Você volta para o login. Seus dados continuam neste aparelho."
        confirmLabel="Sair"
        onCancel={() => setLeaving(false)}
        onConfirm={() => {
          setLeaving(false);
          void signOut();
        }}
      />
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
