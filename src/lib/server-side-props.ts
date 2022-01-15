import { GetServerSideProps, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

export function wrap<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
>(factory: GetServerSideProps<P, Q, D>): GetServerSideProps<P, Q, D> {
  return async context => {
    try {
      let result = await factory(context);
      return result;
    } catch (error) {
      if (error instanceof RedirectError) {
        return {
          redirect: {
            destination: error.path,
            permanent: false,
          },
        };
      }

      throw error;
    }
  };
}

class RedirectError extends Error {
  name = 'RedirectError';

  constructor(public path: string) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RedirectError);
    }
  }
}

export function redirect(path: string) {
  return new RedirectError(path);
}
