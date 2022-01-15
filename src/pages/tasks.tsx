import Board from '@/components/board';
import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { wrap } from '@/lib/server-side-props';
import { Task } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [tasks, setTasks] = useState(props.tasks);

  return <Board tasks={tasks} setTasks={setTasks} />;
}

export const getServerSideProps = wrap<{ tasks: Task[] }>(async ctx => {
  const user = await getUser(ctx.req, ctx.res);
  const tasks = await prisma.task.findMany({
    where: {
      assignedTo: {
        some: { id: user.id },
      },
    },
  });

  return {
    props: {
      tasks: JSON.parse(JSON.stringify(tasks)),
    },
  };
});
