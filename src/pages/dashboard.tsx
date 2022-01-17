import Sidebar from '@/components/sidebar';
import { getUser } from '@/lib/auth';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { User } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';

export default function Dashboard(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <Sidebar>
      <pre>{JSON.stringify(props.user, null, 2)}</pre>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await getUser(ctx.req, ctx.res);

  return {
    props: {
      user: serialize(user),
    },
  };
});
