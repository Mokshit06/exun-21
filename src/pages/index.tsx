import Board from '@/components/board';
import { getUser } from '@/lib/auth';
import { wrap } from '@/lib/server-side-props';
import { Task } from '@prisma/client';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from 'next';

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <Board tasks={props.tasks} />;
}

export const getServerSideProps = wrap<{ tasks: Task[] }>(async ctx => {
  const user = await getUser(ctx.req, ctx.res);
  const tasks = await prisma.task.findMany({
    where: {
      assignedTo: {
        some: { id: user?.id },
      },
    },
  });

  return {
    props: {
      tasks: JSON.parse(JSON.stringify(tasks)),
    },
  };
});
