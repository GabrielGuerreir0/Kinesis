import { createContext, useContext, type ReactNode } from 'react';

type MenuApi = {
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuApi>({
  openMenu: () => {},
  closeMenu: () => {},
});

export function MenuProvider({ value, children }: { value: MenuApi; children: ReactNode }) {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  return useContext(MenuContext);
}
