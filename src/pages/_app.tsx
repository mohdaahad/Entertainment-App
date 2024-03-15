import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { api } from '~/utils/api';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Layout } from '~/components/Layout';
import { BookmarksContextProvider } from '~/contexts/useBookmarksContext';
import { ThemeProvider } from '~/contexts/useThemeContext';
import '~/styles/globals.css';

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const LayoutComponent =
    router.pathname === '/auth/signin' ? Fragment : Layout;

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <BookmarksContextProvider>
          <ThemeProvider>
            <LayoutComponent>
              <Component {...pageProps} />
            </LayoutComponent>
          </ThemeProvider>
        </BookmarksContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
