import classNames from 'classnames';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';

export const Loader = () => {
  const { themeType } = useThemeContext();
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      <div
        className={classNames(
          'h-12 w-12 animate-spin rounded-full border-4 border-b-primary',
          { 'border-light': themeType === ThemeType.Dark },
          { 'border-grey': themeType === ThemeType.Light },
        )}
      />
    </div>
  );
};
