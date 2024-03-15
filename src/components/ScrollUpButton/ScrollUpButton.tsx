import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';

export const ScrollUpButton = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { themeType } = useThemeContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={classNames(
        'fixed bottom-10 right-10 h-12 w-12 transition-all',
        {
          'scale-0': !isEnabled,
        },
      )}
      onClick={() => window.scrollTo(0, 0)}
    >
      <SvgIcon
        className={classNames(
          'h-12 w-12 rounded-full opacity-60 transition hover:bg-primary hover:opacity-100 ',
          {
            'bg-semi-dark bg-opacity-50 fill-light':
              themeType === ThemeType.Light,
          },
          { 'bg-semi-dark fill-dark': themeType === ThemeType.Dark },
        )}
        viewBox="0 0 48 48"
      >
        {getIconByName(IconName.ARROW_UP)}
      </SvgIcon>
    </button>
  );
};
