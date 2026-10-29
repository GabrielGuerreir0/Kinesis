export type Bar = { label: string; value: number };

export type WearableStatus = 'conectado' | 'espera' | 'bateria';

export type Wearable = {
  id: string;
  name: string;
  kind: string;
  battery: number;
  signal: string;
  status: WearableStatus;
};

export const metrics = [
  { label: 'Sono', value: '7h 20' },
  { label: 'Profundo', value: '1h 40' },
  { label: 'Qualidade', value: '86' },
  { label: 'Recuperação', value: '78' },
];

export const sleep: Bar[] = [
  { label: 'Seg', value: 6.8 },
  { label: 'Ter', value: 7.4 },
  { label: 'Qua', value: 5.9 },
  { label: 'Qui', value: 8.1 },
  { label: 'Sex', value: 7.2 },
  { label: 'Sáb', value: 8.6 },
  { label: 'Dom', value: 7.3 },
];

export const recovery: Bar[] = [
  { label: 'Seg', value: 72 },
  { label: 'Ter', value: 80 },
  { label: 'Qua', value: 64 },
  { label: 'Qui', value: 86 },
  { label: 'Sex', value: 78 },
  { label: 'Sáb', value: 88 },
  { label: 'Dom', value: 83 },
];

export const devices: Wearable[] = [
  { id: 'halo', name: 'Halo Ring', kind: 'Anel', battery: 67, signal: 'agora', status: 'conectado' },
  { id: 'band-l2', name: 'Band L2', kind: 'Pulseira', battery: 41, signal: '12 min', status: 'conectado' },
  { id: 'pulse-k1', name: 'Pulse K1', kind: 'Relógio', battery: 82, signal: '2 h', status: 'espera' },
  { id: 'faixa', name: 'Faixa Noite', kind: 'Sono', battery: 15, signal: 'ontem', status: 'bateria' },
];
