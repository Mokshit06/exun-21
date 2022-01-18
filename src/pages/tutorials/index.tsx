import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';

export default function AllTutorials(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tutorials } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700}>
          Tutorials
        </Heading>
        <pre>{JSON.stringify(tutorials, null, 2)}</pre>
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
