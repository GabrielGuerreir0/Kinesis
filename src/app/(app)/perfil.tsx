import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { NavRow } from '@/components/NavRow';
import { ProfilePhoto } from '@/components/ProfilePhoto';
import { Screen } from '@/components/Screen';
import { useAvatar } from '@/hooks/useAvatar';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function ProfileScreen() {
  const form = useProfileForm();
  const styles = useThemedStyles(makeStyles);
  const avatar = useAvatar();

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <ProfilePhoto name={form.draft.name} photo={avatar.photo} size={96} />
        <Text style={styles.heroName}>{form.draft.name}</Text>
        <Text style={styles.heroMail}>{form.draft.email}</Text>
      </View>
      <Text style={styles.section}>Foto de perfil</Text>
      <NavRow icon="image" title="Escolher da galeria" detail="Alterar a foto salva neste aparelho" onPress={() => void avatar.fromLibrary()} />
      <NavRow icon="camera" title="Tirar foto" detail="Usar a câmera frontal" onPress={() => void avatar.fromCamera()} />
      {avatar.photo ? (
        <NavRow icon="trash" title="Remover foto" detail="Voltar para a inicial do nome" onPress={() => void avatar.remove()} />
      ) : null}
      {avatar.pending ? <Text style={styles.ok}>Atualizando foto…</Text> : null}
      {avatar.error ? <Text style={styles.error}>{avatar.error}</Text> : null}
      <Text style={styles.section}>Dados pessoais</Text>
      <Field label="Nome" value={form.draft.name} onChangeText={(name) => form.patch({ name })} autoCapitalize="words" />
      <Field
        label="E-mail"
        value={form.draft.email}
        onChangeText={(email) => form.patch({ email })}
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="Telefone"
        value={form.draft.phone}
        onChangeText={(phone) => form.patch({ phone })}
        keyboardType="phone-pad"
        autoComplete="tel"
      />
      <Field
        label="Nova senha"
        value={form.password}
        onChangeText={form.setPasswordDraft}
        secureTextEntry
        placeholder="Deixe em branco para manter"
      />
      {form.error ? <Text style={styles.error}>{form.error}</Text> : null}
      {form.message ? <Text style={styles.ok}>{form.message}</Text> : null}
      <Button label={form.pending ? 'Salvando…' : 'Salvar'} onPress={() => void form.save()} disabled={form.pending} />
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  heroName: { color: colors.text, fontSize: 22, fontWeight: '700' },
  heroMail: { color: colors.muted, fontSize: 14 },
  section: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
  error: { color: colors.danger, fontSize: 14 },
  ok: { color: colors.accent, fontSize: 14 },
  });
