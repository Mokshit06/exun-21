import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import { Box, Heading } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next';

export default function SingleTutorial(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tutorial } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700}>
          {tutorial.title}
        </Heading>
        <pre>{JSON.stringify(tutorial, null, 2)}</pre>
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
