import Board from '@/components/board';
import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { Task, User } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

export default function Tasks(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [tasks, setTasks] = useState(props.tasks);

  return (
    <Box bg="theme.darkGrey" h="100vh" px={10} py={8}>
      <Heading color="theme.light" mb={8}>
        Kanban
      </Heading>
      <Board tasks={tasks} setTasks={setTasks} />
    </Box>
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
    },
  });

  return {
    props: {
      tasks: serialize(tasks),
    },
  };
});
