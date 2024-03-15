/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import avatar from '~/../public/images/avatar.svg';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';
import { NavBarLink } from './NavBarLink';

export const NavBar = () => {
  const [isSignOut, setIsSignOut] = useState(false);
  const { data: sessionData } = useSession();

  const { themeType, setCurrentTheme } = useThemeContext();

  const handleThemeChange = () => {
    if (themeType === ThemeType.Dark) {
      setCurrentTheme(ThemeType.Light);

      return;
    }

    setCurrentTheme(ThemeType.Dark);
  };

  const router = useRouter();

  return (
    <div
      className="
      absolute left-0 right-0 top-0
      sm:left-6 sm:right-6 sm:py-6
      lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:w-40 lg:p-8
      "
    >
      <div
        className={classNames(
          'flex h-full items-center justify-between bg-primary p-4 transition duration-500 sm:rounded-xl sm:hover:shadow-md lg:flex-col lg:rounded-[20px] lg:p-7',
          { 'bg-semi-dark': themeType === ThemeType.Dark },
        )}
      >
        <div className="flex items-center justify-end gap-4 sm:gap-8 lg:flex-col">
          <Link href="/">
            <SvgIcon
              className={classNames(
                'h-8 w-8 transition hover:opacity-75',
                {
                  'fill-primary': themeType === ThemeType.Dark,
                },
                {
                  'fill-light': themeType === ThemeType.Light,
                },
              )}
              viewBox="0 0 32 26"
            >
              {getIconByName(IconName.LOGO)}
            </SvgIcon>
          </Link>

          <ul className="left-1/2 flex gap-1 min-[370px]:absolute min-[370px]:-translate-x-1/2 min-[370px]:gap-2 sm:gap-4 lg:relative lg:flex-col">
            <li>
              <NavBarLink href="/">{getIconByName(IconName.HOME)}</NavBarLink>
            </li>
            <li>
              <NavBarLink href="/movies">
                {getIconByName(IconName.MOVIE)}
              </NavBarLink>
            </li>
            <li>
              <NavBarLink href="/tv">
                {getIconByName(IconName.TV)}
              </NavBarLink>
            </li>
            {sessionData && (
              <li>
                <NavBarLink href="/bookmarks">
                  {getIconByName(IconName.BOOKMARK)}
                </NavBarLink>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 lg:flex-col">
          <div className="relative">
            {sessionData?.user && (
              <div
                className={`
              absolute -bottom-1 -right-1 flex flex-nowrap items-center rounded-full text-dark
              transition-all lg:-left-1 lg:items-start lg:justify-center
              ${
                themeType === ThemeType.Dark
                  ? 'bg-primary hover:bg-light'
                  : 'bg-light hover:bg-grey'
              }
              ${
                isSignOut
                  ? 'h-10 w-32 scale-100 pr-8 opacity-100 sm:w-36 lg:h-24 lg:w-12 lg:pr-0'
                  : 'h-10 w-4 scale-0 pr-0 opacity-0 lg:w-12'
              }`}
              >
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex items-center gap-2 p-1"
                  aria-label="logout"
                  title="Logout"
                >
                  <SvgIcon
                    className="transition-color h-6 w-6 fill-none stroke-dark p-1 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {getIconByName(IconName.EXIT)}
                  </SvgIcon>
                  <p className="lg:hidden">{isSignOut ? 'Logout' : ''}</p>
                </button>
              </div>
            )}

            <button
              className="block"
              onClick={
                sessionData?.user
                  ? () => setIsSignOut((state) => !state)
                  : () => void router.push('/auth/signin')
              }
            >
              <div
                className={classNames(
                  'relative h-8 w-8 overflow-hidden rounded-full border border-light bg-primary sm:h-8 sm:w-8 lg:h-10 lg:w-10',
                  {
                    'bg-semi-dark': themeType === ThemeType.Light,
                  },
                )}
              >
                {sessionData?.user ? (
                  <Image
                    src={sessionData?.user?.image ?? avatar}
                    alt={sessionData?.user?.name ?? 'user name'}
                    fill
                  />
                ) : (
                  <SvgIcon
                    className={classNames('fill-light px-1 pt-1', {
                      'fill-semi-dark': themeType === ThemeType.Dark,
                    })}
                    viewBox="0 0 24 24"
                  >
                    {getIconByName(IconName.AVATAR)}
                  </SvgIcon>
                )}
              </div>
            </button>
          </div>

          <button
            type="button"
            className="flex items-center justify-center p-1"
            onClick={handleThemeChange}
          >
            {themeType === ThemeType.Dark && (
              <SvgIcon
                className="h-6 w-6 fill-grey transition hover:fill-primary sm:h-6 sm:w-6"
                viewBox="0 0 21 22"
              >
                {getIconByName(IconName.MOON)}
              </SvgIcon>
            )}
            {themeType === ThemeType.Light && (
              <SvgIcon
                className="h-6 w-6 fill-light transition hover:fill-semi-dark sm:h-6 sm:w-6"
                viewBox="0 0 21 22"
              >
                {getIconByName(IconName.SUN)}
              </SvgIcon>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
