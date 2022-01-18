import Sidebar from '@/components/sidebar';
import Tag from '@/components/tag';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Grid, Heading, Image, Flex, Text } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export default function AllTutorials(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tutorials } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700} mb={8}>
          Tutorials
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)">
          {tutorials.map(tutorial => {
            const { videoURL } = tutorial;
            const imageURL =
              videoURL.slice(0, videoURL.lastIndexOf('.')) + '.jpg';

            return (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.id}`}
                passHref
              >
                <Box as="a" shadow="md" bg="theme.grey" p={2} rounded="md">
                  <Image
                    src={imageURL}
                    h="180px"
                    alt={tutorial.title}
                    rounded="md"
                  />
                  <Flex flexDir="column" gridGap={2}>
                    <Text color="theme.light" fontWeight={500} fontSize="xl">
                      {tutorial.title}
                    </Text>
                    <Text color="theme.lightGrey">{tutorial.description}</Text>
                    <Flex gridGap={2}>
                      {tutorial.tags.map((tag, index) => (
                        <Tag key={index} size="md">
                          {tag}
                        </Tag>
                      ))}
                    </Flex>
                  </Flex>
                </Box>
              </Link>
            );
          })}
        </Grid>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const tutorials = await prisma.tutorial.findMany();

  return {
    props: { tutorials: serialize(tutorials) },
  };
});
