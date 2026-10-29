export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  rest: string;
  ink: string;
  danger: string;
};

export const palettes = {
  light: {
    bg: '#F2F6F4',
    surface: '#FFFFFF',
    surface2: '#E8F3EE',
    line: '#D3E6DD',
    text: '#122018',
    muted: '#5C7368',
    accent: '#0B7A5A',
    accentSoft: '#E6F5EF',
    rest: '#7EBF9E',
    ink: '#FFFFFF',
    danger: '#C0392B',
  },
  dark: {
    bg: '#07110D',
    surface: '#12211B',
    surface2: '#1B2E26',
    line: '#2D463C',
    text: '#F2F7F4',
    muted: '#A9C0B6',
    accent: '#149E6B',
    accentSoft: '#1A332A',
    rest: '#3D7A62',
    ink: '#FFFFFF',
    danger: '#E07A7A',
  },
} satisfies Record<'light' | 'dark', Palette>;

export const colors = palettes.light;
