import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Grid, Heading, Text, Avatar, Flex } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export default function Users(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { users } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700} mb={8}>
          Employees
        </Heading>
        <Grid gridGap={3} templateColumns="repeat(3, 1fr)">
          {users.map(user => (
            <Link key={user.id} href={`/users/${user.id}`} passHref>
              <Flex
                as="a"
                p={4}
                bg="theme.mediumGrey"
                shadow="lg"
                rounded="md"
                align="center"
                gridGap={4}
              >
                <Avatar name={user.name} src="" />
                <Box>
                  <Text fontSize="lg" fontWeight={600}>
                    {user.name}
                  </Text>
                  <Text>{user.email}</Text>
                </Box>
              </Flex>
            </Link>
          ))}
        </Grid>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const users = await prisma.user.findMany({
    // where: { isAdmin: false },
  });

  return {
    props: { users: serialize(users) },
  };
});
