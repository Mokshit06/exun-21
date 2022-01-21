import Sidebar from '@/components/sidebar';
import { getUser } from '@/lib/auth';
import { wrap } from '@/lib/server-side-props';
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik, useField } from 'formik';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

function CreateRecipeForm({ isDisabled }: { isDisabled: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, , nameHelpers] = useField('name');
  const [descriptionInput, , descriptionHelpers] = useField('description');
  const [priceInput, , priceHelpers] = useField('price');
  const [directionsInput, , directionsHelpers] = useField('directions');
  const [ingredientsInput, , ingredientsHelpers] = useField('ingredients');
  const handleSuggest = async () => {
    setIsLoading(true);
    const { description, recipe } = await axios
      .post<{
        description: string;
        recipe: {
          ingredients: string;
          directions: string;
        };
      }>('/api/recipes/suggest', {
        name: nameInput.value,
      })
      .then(r => r.data);

    descriptionHelpers.setValue(description);
    ingredientsHelpers.setValue(recipe.ingredients);
    directionsHelpers.setValue(recipe.directions);
    setIsLoading(false);
  };

  return (
    <Box as={Form} d="flex" flexDir="column" gridGap={5} maxW="900px">
      <Editable
        fontSize="4xl"
        fontWeight={700}
        fontFamily="Inter"
        defaultValue="Untitled Recipe"
        value={nameInput.value}
        color="theme.light"
        onChange={value => nameHelpers.setValue(value)}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
      <FormControl>
        <FormLabel color="theme.lightGrey" fontSize="xl">
          Description
        </FormLabel>
        <Textarea
          rounded="lg"
          color="theme.light"
          fontSize="md"
          bg="theme.mediumGrey"
          outline="none"
          py={3}
          rows={4}
          lineHeight={1.6}
          border="none"
          {...descriptionInput}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="theme.lightGrey" fontSize="xl">
          Ingredients
        </FormLabel>
        <Textarea
          rounded="lg"
          color="theme.light"
          fontSize="md"
          bg="theme.mediumGrey"
          py={3}
          border="none"
          outline="none"
          rows={5}
          {...ingredientsInput}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="theme.lightGrey" fontSize="xl">
          Directions
        </FormLabel>
        <Textarea
          rounded="lg"
          color="theme.light"
          fontSize="md"
          bg="theme.mediumGrey"
          py={3}
          border="none"
          outline="none"
          rows={5}
          {...directionsInput}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="theme.lightGrey" fontSize="xl">
          Price
        </FormLabel>
        <InputGroup color="theme.light">
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
          >
            ₹
          </InputLeftElement>
          <Input
            py={3}
            rounded="lg"
            fontSize="md"
            bg="theme.mediumGrey"
            border="none"
            type="number"
            min={1}
            {...priceInput}
          />
        </InputGroup>
      </FormControl>
      <Flex marginLeft="auto" gridGap={4}>
        <Button
          fontWeight={400}
          type="button"
          size="lg"
          onClick={handleSuggest}
          isLoading={isLoading}
          bg="#5b4019"
          color="#c18435"
          _hover={{ bg: '#5b4019' }}
          _active={{ bg: '#5b4019' }}
        >
          Suggest
        </Button>
        <Button
          size="lg"
          fontWeight={400}
          bg="#253c56"
          color="#2787e3"
          _hover={{ bg: '#293e57' }}
          _active={{ bg: '#293e57' }}
          type="submit"
          disabled={isDisabled}
        >
          Add Recipe
        </Button>
      </Flex>
    </Box>
  );
}

export default function NewRecipe(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const toast = useToast();
  const router = useRouter();
  const handleSubmit = async (values: typeof initialValues) => {
    await axios.post('/api/recipes', values);
    toast({
      title: `Created ${values.name}`,
      status: 'success',
      containerStyle: { color: '#0a0a0a' },
    });
    router.push('/recipes');
  };
  const initialValues = {
    name: 'Raspberry chocolate',
    description: '',
    ingredients: '',
    directions: '',
    price: 10,
  };

  return (
    <Sidebar>
      <Box px={10} py={8}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <CreateRecipeForm isDisabled={!props.user.isAdmin} />
        </Formik>
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await getUser(ctx.req, ctx.res);

  return {
    props: { user },
  };
});
