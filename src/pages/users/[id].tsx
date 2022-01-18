import { wrap } from '@/lib/server-side-props';
import { serialize } from '@/lib/serialize';
import prisma from '@/lib/prisma';
import { InferGetServerSidePropsType } from 'next';
import Sidebar from '@/components/sidebar';
import { Box, Heading } from '@chakra-ui/react';

// show number of hours each week
// trials being done
// assigned tasks
// image and name
export default function SingleUser(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700}>
          Employees
        </Heading>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.query.id as string },
  });

  return {
    props: { user: serialize(user!) },
  };
});
