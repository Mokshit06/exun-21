import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';

export default function Users(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { users } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700}>
          Employees
        </Heading>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const users = await prisma.user.findMany({
    where: { isAdmin: false },
  });

  return {
    props: { users: serialize(users) },
  };
});
