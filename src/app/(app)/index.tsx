import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BarChart } from '@/components/BarChart';
import { MetricGrid } from '@/components/MetricGrid';
import { Screen } from '@/components/Screen';
import { VideoUpload } from '@/components/VideoUpload';
import { WearableTable } from '@/components/WearableTable';
import { useDashboard } from '@/hooks/useDashboard';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

type Tab = 'resumo' | 'envio';

export default function DashboardScreen() {
  const board = useDashboard();
  const styles = useThemedStyles(makeStyles);
  const [tab, setTab] = useState<Tab>('resumo');

  return (
    <Screen scroll>
      <Text style={styles.eyebrow}>Descanso</Text>
      <Text style={styles.hello}>Olá, {board.name}</Text>
      <View style={styles.tabs}>
        <TabButton label="Resumo" active={tab === 'resumo'} onPress={() => setTab('resumo')} />
        <TabButton label="Enviar vídeo" active={tab === 'envio'} onPress={() => setTab('envio')} />
      </View>
      {tab === 'resumo' ? (
        <>
          <Text style={styles.lead}>Sono e bem-estar lidos dos sensores vestíveis, neste aparelho.</Text>
          <Text style={styles.note}>Bluetooth {board.bluetoothAllowed ? 'autorizado' : 'pendente'}</Text>
          <MetricGrid items={board.metrics} />
          <BarChart title="Sono" unit="horas por noite" bars={board.sleep} />
          <BarChart title="Recuperação" unit="índice de bem-estar" bars={board.recovery} tone="rest" />
          <WearableTable rows={board.devices} />
        </>
      ) : (
        <VideoUpload />
      )}
    </Screen>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabOn]}>
      <Text numberOfLines={1} style={[styles.tabLabel, active && styles.tabLabelOn]}>
        {label}
      </Text>
    </Pressable>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '700', letterSpacing: 0.6 },
  hello: { color: colors.text, fontSize: 32, fontWeight: '700' },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  note: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  tabs: { flexDirection: 'row', gap: 8, alignSelf: 'stretch' },
  tab: { flexGrow: 1, flexBasis: 0, backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  tabOn: { backgroundColor: colors.accent },
  tabLabel: { color: colors.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  tabLabelOn: { color: colors.ink },
  });
