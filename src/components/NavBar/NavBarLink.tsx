import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';

type Props = {
  href: string;
  children: React.ReactNode;
};

export const NavBarLink: React.FC<Props> = (props) => {
  const { pathname } = useRouter();
  const { href, children } = props;
  const { themeType } = useThemeContext();

  return (
    <Link href={href} className="block p-2">
      <SvgIcon
        className={classNames(
          'h-5 w-5 fill-grey transition hover:fill-primary',
          {
            'fill-light hover:fill-semi-dark': themeType === ThemeType.Light,
            'fill-semi-dark hover:fill-dark':
              pathname === href && themeType === ThemeType.Light,
            'fill-light': pathname === href,
          },
        )}
      >
        {children}
      </SvgIcon>
    </Link>
  );
};
