import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import axios from 'axios';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/globals.css';

const theme: Partial<ChakraTheme> = {
  colors: {
    theme: {
      light: '#e4e4e4',
      lightGrey: '#999999',
      darkGrey: '#212121',
      mediumGrey: '#383838',
      grey: '#292929',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Avenir',
  },
  styles: {
    global: {
      body: {
        colorScheme: 'dark',
        color: 'theme.light',
      },
    },
  },
};
const extendedTheme = extendTheme(theme);

function MyApp({ Component, pageProps }: AppProps) {
  const [client] = useState(() => new QueryClient());
  const router = useRouter();

  useEffect(() => {
    const enabled =
      process.env.NODE_ENV === 'production' || !!router.query.session;
    const startedAt = new Date();
    const handler = async () => {
      if (enabled) {
        await axios.post('/api/session', {
          startedAt,
          endedAt: new Date(),
        });
      }
    };

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [router]);

  return (
    <ChakraProvider theme={extendedTheme}>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <QueryClientProvider client={client}>
        <Hydrate state={pageProps.dehydratedState}>
          <ReactQueryDevtools />
          <DndProvider backend={HTML5Backend}>
            <Component {...pageProps} />
          </DndProvider>
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
