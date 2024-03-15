import React, { useContext, type ReactNode } from 'react';
import { ThemeType } from '~/types/ThemeType';
import { useLocalTheme } from '~/hooks/useLocalTheme';

interface ThemeContextProps {
  themeType: ThemeType;
  setCurrentTheme: (value: ThemeType) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  themeType: ThemeType.Dark,
} as ThemeContextProps);

type Props = {
  children?: ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalTheme();

  return (
    <ThemeContext.Provider value={{ themeType: currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const themeContext = useContext(ThemeContext);

  if (themeContext === undefined) {
    throw new Error('useThemeContext must be inside a ThemeContext');
  }

  return themeContext;
};
