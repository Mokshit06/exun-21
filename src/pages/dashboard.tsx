import { getUser } from '@/lib/auth';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { User } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';

export default function Dashboard(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <pre>{JSON.stringify(props.user, null, 2)}</pre>;
}

export const getServerSideProps = wrap(async ctx => {
  const user = await getUser(ctx.req, ctx.res);

  return {
    props: {
      user: serialize(user),
    },
  };
});
