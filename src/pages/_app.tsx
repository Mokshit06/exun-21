import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
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
        color: 'theme.light',
      },
    },
  },
};
const extendedTheme = extendTheme(theme);

function MyApp({ Component, pageProps }: AppProps) {
  const [client] = useState(() => new QueryClient());

  return (
    <ChakraProvider theme={extendedTheme}>
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
