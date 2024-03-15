/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import classNames from 'classnames';
import { type NextPage } from 'next';
import { type BuiltInProviderType } from 'next-auth/providers';
import { signIn, useSession, type LiteralUnion } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { env } from 'process';
import { useEffect, useState } from 'react';
import { Loader } from '~/components/Loader';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';
import github from '../../../public/images/github.svg';
import google from '../../../public/images/google.svg';

const buttonClasses =
  'flex gap-x-5 justify-center items-center font-light border border-grey rounded-lg w-full py-4 hover:bg-primary hover:border-primary hover:text-dark transition-all';

const SignIn: NextPage = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { themeType } = useThemeContext();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirectToHomePage = async () => {
      if (status === 'authenticated') {
        await router.push('/').catch(() => console.error('error occured'));
      }
    };

    redirectToHomePage().catch((err) => console.error(err));
  }, [status]);

  const handleSignInClick = (provider: LiteralUnion<BuiltInProviderType>) => {
    signIn(provider, {
      callbackUrl: env.NEXTAUTH_URL,
    }).catch((err) => console.error(err));
  };

  return (
    <section
      className={classNames(
        'flex h-screen flex-col items-center justify-center gap-20',
        { 'bg-dark': themeType === ThemeType.Dark },
      )}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Link href="/">
            <SvgIcon className="h-8 w-8 fill-primary" viewBox="0 0 32 32">
              {getIconByName(IconName.LOGO)};
            </SvgIcon>
          </Link>

          <div
            className={classNames(
              'font-body flex w-4/5 flex-col rounded-3xl bg-grey px-8 pb-28 pt-8 text-light sm:w-1/2 lg:w-1/3 xl:w-1/4',
              { 'bg-semi-dark': themeType === ThemeType.Dark },
            )}
          >
            <h1 className="font-body mb-16 text-center text-3xl">Login</h1>

            <div className="flex flex-col gap-y-6">
              <button
                type="button"
                className={classNames(buttonClasses, {
                  'border-light': themeType === ThemeType.Light,
                })}
                onClick={() => void handleSignInClick('google')}
              >
                <Image src={google} alt="google" width="28" height="28" />
                Login with Google
              </button>

              <button
                type="button"
                className={classNames(buttonClasses, {
                  'border-light': themeType === ThemeType.Light,
                })}
                onClick={() => void handleSignInClick('github')}
              >
                <Image src={github} alt="google" width="28" height="28" />
                Login with GitHub
              </button>

              <Link
                href="/"
                className="text-center transition-all hover:text-primary"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default SignIn;
