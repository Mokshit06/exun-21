import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading, Flex, Text, Divider } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';

export default function SingleTutorial(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tutorial } = props;

  return (
    <Sidebar>
      <Box p={10}>
        {/* <Heading color="theme.light" fontWeight={700} mb={8}>
          {tutorial.title}
        </Heading> */}
        <Box>
          <Flex justifyContent="center" mb={8}>
            <Box
              w="full"
              controls
              as="video"
              poster={
                tutorial.videoURL.slice(0, tutorial.videoURL.lastIndexOf('.')) +
                '.jpg'
              }
              src={tutorial.videoURL}
              maxH="60vh"
            />
          </Flex>
          <Box>
            <Heading color="theme.light" fontSize="3xl" fontWeight={700} mb={3}>
              {tutorial.title}
            </Heading>
            <Divider borderColor="theme.lightGrey" />
            <Text fontSize="lg" mt={4}>
              {tutorial.description}
            </Text>
          </Box>
        </Box>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: ctx.query.id as string },
  });

  return {
    props: { tutorial: serialize(tutorial!) },
  };
});
