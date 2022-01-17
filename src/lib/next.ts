import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { useQuery } from 'react-query';

declare const __NEXT_DATA__: { buildId: string };

export async function fetchServerSideProps<T>(page: string) {
  const r = await axios.get<{
    pageProps: InferGetServerSidePropsType<T>;
  }>(`/_next/data/${__NEXT_DATA__.buildId}/${page}.json`);

  return r.data.pageProps;
}

export function useServerSideProps<T>(
  page: string,
  initialData: InferGetServerSidePropsType<T>
) {
  const { data, ...rest } = useQuery(
    page,
    () => fetchServerSideProps<T>(page),
    { initialData }
  );

  return {
    data: data!,
    ...rest,
  };
}
