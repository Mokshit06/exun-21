import { wrap } from '@/lib/server-side-props';
import { serialize } from '@/lib/serialize';
import prisma from '@/lib/prisma';
import { InferGetServerSidePropsType } from 'next';
import Sidebar from '@/components/sidebar';
import { Box, Heading, Flex, Avatar, Text, Grid } from '@chakra-ui/react';
import Tag from '@/components/tag';

// show number of hours each week
// trials being done
// assigned tasks
// image and name
export default function SingleUser(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user } = props;
  const totalTime = user.sessions
    .map(s => Number(s.endedAt) - Number(s.startedAt))
    .reduce((acc, cur) => acc + cur, 0);

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700} mb={8}>
          Employees
        </Heading>
        <Flex
          bg="theme.grey"
          w="max-content"
          py={4}
          px={6}
          rounded="md"
          mb={6}
          gridGap={6}
          align="center"
        >
          <Avatar size="lg" name={user.name} src="" />
          <Box color="theme.light">
            <Heading fontSize="3xl" mb={2} fontWeight={600}>
              {user.name}
            </Heading>
            <Text mb={1}>Email: {user.email}</Text>
            <Text>Joined at: {user.createdAt}</Text>
          </Box>
        </Flex>
        <Grid templateColumns="1fr 1fr" gridGap={4}>
          <Flex flexDir="column" bg="theme.mediumGrey" rounded="md" p={2}>
            <Heading
              fontSize="2xl"
              m={2}
              mb={4}
              fontWeight={500}
              color="theme.light"
            >
              Tasks Assigned
            </Heading>
            <Flex flexDir="column" gridGap={2}>
              {user.tasks.map(task => (
                <Box
                  bg="theme.darkGrey"
                  py={3}
                  px={4}
                  rounded="md"
                  key={task.id}
                  shadow="md"
                >
                  <Text fontSize="md" mb={2}>
                    {task.title}
                  </Text>
                  <Flex gridGap={2}>
                    {task.tags.map((tag, index) => (
                      <Tag size="md" key={index}>
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Flex>
          <Flex flexDir="column" bg="theme.mediumGrey" rounded="md" p={2}>
            <Heading
              fontSize="2xl"
              m={2}
              mb={4}
              fontWeight={500}
              color="theme.light"
            >
              Sessions
            </Heading>
            <Flex flexDir="column" gridGap={2}>
              {user.sessions.map(session => (
                <Box
                  bg="theme.darkGrey"
                  py={3}
                  px={4}
                  rounded="md"
                  key={session.id}
                  shadow="md"
                >
                  <Text>Started at: {session.startedAt}</Text>
                  <Text>Ended at: {session.endedAt}</Text>
                </Box>
              ))}
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.query.id as string },
    include: { trials: true, tasks: true, sessions: true },
  });

  return {
    props: { user: serialize(user!) },
  };
});
