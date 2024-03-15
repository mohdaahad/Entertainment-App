import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { NavBar } from '~/components/NavBar';
import { ScrollUpButton } from '~/components/ScrollUpButton';
import { SearchBar } from '~/components/SearchBar';

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const { themeType } = useThemeContext();

  useEffect(() => {
    if (themeType === ThemeType.Dark) {
      document.documentElement.style.setProperty('--MyBackColor', '#171717');

      return;
    }

    document.documentElement.style.setProperty('--MyBackColor', '#F5F5F5');
  }, [themeType]);

  return (
    <main
      className={classNames(
        'font-body min-h-screen px-4 pb-8 pt-16  selection:bg-primary selection:text-dark sm:px-6 sm:pt-[116px] lg:pl-40 lg:pt-0',
        { 'bg-light text-dark': themeType === ThemeType.Light },
        { 'bg-dark text-light': themeType === ThemeType.Dark },
      )}
    >
      <NavBar />

      <SearchBar />

      <div className="pb-10">{children}</div>

      <ScrollUpButton />
    </main>
  );
};
