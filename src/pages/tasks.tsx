import Board from '@/components/board';
import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { Task, User } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [tasks, setTasks] = useState(props.tasks);

  return (
    <Box bg="theme.darkGrey" h="100vh" px={10} py={8}>
      <Heading color="#e4e4e4" mb={8}>
        Kanban
      </Heading>
      <Board tasks={tasks} setTasks={setTasks} />
    </Box>
  );
}

export const getServerSideProps = wrap<{
  tasks: Array<Task & { assignedTo: User[] }>;
}>(async ctx => {
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
      tasks: JSON.parse(JSON.stringify(tasks)),
    },
  };
});
