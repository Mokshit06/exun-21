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
} from '@chakra-ui/react';
import { Form, Formik, useField } from 'formik';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Recipe(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { recipes } = props;
  const router = useRouter();

  return (
    <Sidebar>
      <Box px={10} py={10}>
        <Flex align="center" justify="space-between">
          <Heading color="theme.light" fontWeight={700} mb={8}>
            Recipes
          </Heading>
          <Button
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
        <Grid>
          {recipes.map(recipe => (
            <GridItem key={recipe.id}>{recipe.name}</GridItem>
          ))}
        </Grid>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const recipes = await prisma.candy.findMany({
    include: {
      ingredients: true,
      CandyTrial: true,
    },
  });

  return {
    props: { recipes },
  };
});
