import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { useRecover } from '@/hooks/useRecover';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function RecoverScreen() {
  const form = useRecover();
  const styles = useThemedStyles(makeStyles);

  return (
    <Screen scroll>
      <Text style={styles.lead}>Defina uma nova senha para a conta local.</Text>
      <Field
        label="E-mail da conta"
        value={form.email}
        onChangeText={form.setEmail}
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="Nova senha"
        value={form.password}
        onChangeText={form.setPassword}
        secureTextEntry
        textContentType="newPassword"
      />
      <Field
        label="Confirmar senha"
        value={form.confirm}
        onChangeText={form.setConfirm}
        secureTextEntry
        textContentType="newPassword"
      />
      {form.error ? <Text style={styles.error}>{form.error}</Text> : null}
      <Button
        label={form.pending ? 'Salvando…' : 'Salvar senha'}
        onPress={() => void form.submit()}
        disabled={form.pending}
      />
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  lead: { color: colors.muted, fontSize: 16 },
  error: { color: colors.danger, fontSize: 14 },
  });
