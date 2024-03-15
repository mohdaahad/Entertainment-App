import { useEffect, useState } from 'react';
import { ThemeType } from '~/types/ThemeType';

type SetTheme = (value: ThemeType) => void;

const themeKey = 'theme';
const initialTheme = ThemeType.Dark;

export const useLocalTheme = (): [ThemeType, SetTheme] => {
  const getTheme = () => {
    if (typeof window === 'undefined') {
      return initialTheme;
    }

    try {
      const item = localStorage.getItem(themeKey);
      return item ? (item as ThemeType) : initialTheme;
    } catch (err) {
      console.log(themeKey, err);

      return initialTheme;
    }
  }

  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  const saveTheme = (value: ThemeType) => {
    setTheme(value);
    localStorage.setItem(themeKey, value);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(getTheme());
    }
  }, []);

  return [theme, saveTheme];
}