import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { useLogin } from '@/hooks/useLogin';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const form = useLogin();

  return (
    <Screen scroll>
      <View style={{ height: insets.top }} />
      <Text style={styles.eyebrow}>Sono e bem-estar</Text>
      <Text style={styles.mark}>Kinesis</Text>
      <Text style={styles.lead}>Entre com a conta salva neste aparelho.</Text>
      <Field
        label="E-mail"
        value={form.email}
        onChangeText={form.setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Field
        label="Senha"
        value={form.password}
        onChangeText={form.setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
      {form.error ? <Text style={styles.error}>{form.error}</Text> : null}
      {form.seedLogin ? (
        <Text style={styles.hint}>Conta inicial: {form.emailHint} · senha kinesis</Text>
      ) : null}
      <Button label={form.pending ? 'Entrando…' : 'Entrar'} onPress={() => void form.submit()} disabled={form.pending} />
      <Link href="/recuperar-senha" style={styles.link}>
        Esqueci a senha
      </Link>
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '700', letterSpacing: 0.6, marginTop: 28 },
  mark: { color: colors.accent, fontSize: 40, fontWeight: '700' },
  lead: { color: colors.muted, fontSize: 16 },
  error: { color: colors.danger, fontSize: 14 },
  hint: { color: colors.muted, fontSize: 13 },
  link: { color: colors.accent, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  });
