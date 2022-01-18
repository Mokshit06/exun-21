import prisma from '@/lib/prisma';
import { wrap } from '@/lib/server-side-props';
import { serialize } from '@/lib/serialize';
import { InferGetServerSidePropsType } from 'next';
import Sidebar from '@/components/sidebar';
import { Box, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

function newLineToBr(line: string) {
  const doubleNewLine = line.split('\n\n');
  if (doubleNewLine.length > 1) {
    return doubleNewLine.flatMap((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  }

  return line.split('\n').flatMap((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));
}

export default function SingleRecipe(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { recipe } = props;

  return (
    <Sidebar>
      <Box p={10}>
        <Heading color="theme.light" fontWeight={700} mb={8}>
          {recipe.name}
        </Heading>
        {/* <Image
          position="sticky"
          src={recipe.image}
          width="100%"
          maxH="30vh"
          objectFit="cover"
          rounded="md"
          objectPosition="center"
        /> */}
        <Flex justifyContent="space-between" gridGap={8}>
          <Flex flexDir="column" gridGap={4}>
            <Box bg="theme.grey" py={4} px={5} rounded="md">
              <Box mb={2} maxW="min-content">
                <Text
                  fontFamily="Inter"
                  color="theme.light"
                  fontSize="2xl"
                  fontWeight={500}
                >
                  Description
                </Text>
                <Divider h={1} />
              </Box>
              <Text color="theme.lightGrey" fontSize="md" lineHeight={1.6}>
                {newLineToBr(recipe.description)}
              </Text>
            </Box>
            <Box bg="theme.grey" py={4} px={5} rounded="md">
              <Box mb={2} maxW="min-content">
                <Text
                  fontFamily="Inter"
                  color="theme.light"
                  fontSize="2xl"
                  fontWeight={500}
                >
                  Ingredients
                </Text>
                <Divider h={1} />
              </Box>
              <Text color="theme.lightGrey" fontSize="md" lineHeight={1.6}>
                {newLineToBr(recipe.ingredients)}
              </Text>
            </Box>
            <Box bg="theme.grey" py={4} px={5} rounded="md">
              <Box mb={2} maxW="min-content">
                <Text
                  fontFamily="Inter"
                  color="theme.light"
                  fontSize="2xl"
                  fontWeight={500}
                >
                  Instructions
                </Text>
                <Divider h={1} />
              </Box>
              <Text color="theme.lightGrey" fontSize="md" lineHeight={1.6}>
                {newLineToBr(recipe.directions)}
              </Text>
            </Box>
          </Flex>
          <Image
            position="sticky"
            src={recipe.image}
            width="40%"
            rounded="md"
          />
        </Flex>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const recipe = await prisma.candy.findUnique({
    where: { id: ctx.query.id as string },
    include: { CandyTrial: true },
  });

  return {
    props: { recipe: serialize(recipe!) },
  };
});
