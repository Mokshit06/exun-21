import Board from '@/components/board';
import Chart from '@/components/chart';
import Sidebar from '@/components/sidebar';
import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { Task, User } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Variant = 'kanban' | 'gantt' | 'pie';

const iife = <T,>(func: () => T) => {
  return func();
};

export default function Tasks(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [tasks, setTasks] = useState(props.tasks);
  const router = useRouter();
  const variant = (router.query.type as Variant | undefined) || 'kanban';

  return (
    <Sidebar>
      <Box px={10} py={10}>
        <Heading color="theme.light" fontWeight={700} mb={8}>
          {variant === 'kanban'
            ? 'Kanban'
            : variant === 'gantt'
            ? 'Gantt chart'
            : 'Pie chart'}
        </Heading>
        {iife(() => {
          switch (variant) {
            case 'kanban': {
              return <Board tasks={tasks} setTasks={setTasks} />;
            }
            case 'gantt': {
              return <Chart tasks={tasks} />;
            }
          }
        })}
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await getUser(ctx.req, ctx.res);
  const tasks = await prisma.task.findMany({
    where: {
      assignedTo: {
        some: { id: user.id },
      },
    },
    include: {
      assignedTo: true,
      dependsOn: true,
    },
  });

  return {
    props: {
      tasks: serialize(tasks),
    },
  };
});
