import Sidebar from '@/components/sidebar';
import prisma from '@/lib/prisma';
import { wrap } from '@/lib/server-side-props';
import { useState } from 'react';
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Textarea,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { Form, Formik, useField } from 'formik';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';

export default function Recipe(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { recipes } = props;
  const router = useRouter();

  return (
    <Sidebar>
      <Box px={10} py={10}>
        <Flex align="center" justify="space-between" mb={8}>
          <Heading color="theme.light" fontWeight={700}>
            Recipes
          </Heading>
          <Button
            size="lg"
            color="theme.light"
            bg="theme.grey"
            fontWeight={400}
            _hover={{ bg: 'theme.mediumGrey' }}
            _active={{ bg: 'theme.mediumGrey' }}
            onClick={() => router.push('/recipes/new')}
          >
            New Recipe
          </Button>
        </Flex>
        <Grid gridGap={5} templateColumns="repeat(2, 1fr)">
          {recipes.map(recipe => (
            <GridItem
              key={recipe.id}
              bg="theme.mediumGrey"
              rounded="md"
              shadow="sm"
              p={3}
              d="flex"
              alignItems="center"
              h="min-content"
              gridGap={3}
            >
              <Image
                src={recipe.image}
                w="12rem"
                h="12rem"
                objectFit="cover"
                objectPosition="center"
                rounded="md"
              />
              <Box px={2}>
                <Link href={`/recipes/${recipe.id}`} passHref>
                  <Text color="white" as="a" fontSize="2xl" fontWeight={500}>
                    {recipe.name}
                  </Text>
                </Link>
                <Text
                  mt={3}
                  fontSize="lg"
                  color="theme.light"
                  opacity={0.8}
                  fontWeight={300}
                >
                  {recipe.description.slice(0, 180)}...
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const recipes = await prisma.candy.findMany({});

  return {
    props: { recipes: serialize(recipes) },
  };
});
