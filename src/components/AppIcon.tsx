import type { IconType } from 'react-icons';
import {
  FiBluetooth,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiHome,
  FiImage,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiTrash2,
  FiUpload,
  FiVideo,
} from 'react-icons/fi';

const icons = {
  home: FiHome,
  settings: FiSettings,
  logout: FiLogOut,
  camera: FiCamera,
  image: FiImage,
  trash: FiTrash2,
  chevron: FiChevronRight,
  back: FiChevronLeft,
  menu: FiMenu,
  terms: FiFileText,
  bluetooth: FiBluetooth,
  video: FiVideo,
  upload: FiUpload,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof icons;

export function AppIcon({ name, size = 22, color }: { name: IconName; size?: number; color: string }) {
  const Icon = icons[name];
  return <Icon size={size} color={color} />;
}
