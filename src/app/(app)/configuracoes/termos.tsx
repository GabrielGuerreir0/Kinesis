import { ScrollView, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

const TERMS = [
  'O Kinesis guarda sua conta, senha e preferências neste aparelho.',
  'A câmera e o Bluetooth só são usados depois da autorização nas telas correspondentes.',
  'Você pode alterar seus dados em Perfil ou sair pelo menu.',
  'Este texto é o resumo local de uso do aplicativo e vale para a sessão salva no dispositivo.',
];

export default function TermsScreen() {
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {TERMS.map((line) => (
        <Text key={line} style={styles.body}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14 },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
});
