import Sidebar from '@/components/sidebar';
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
import { useRouter } from 'next/router';
import { useState } from 'react';

function CreateRecipeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, , nameHelpers] = useField('name');
  const [descriptionInput, , descriptionHelpers] = useField('description');
  const [imageURLInput, , imageURLHelpers] = useField('imageURL');
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
          rows={6}
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
          rows={6}
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
            rounded="lg"
            fontSize="md"
            bg="theme.mediumGrey"
            py={3}
            border="none"
            type="number"
            min={1}
            {...priceInput}
          />
        </InputGroup>
      </FormControl>
      <Flex marginLeft="auto" gridGap={4}>
        <Button
          color="theme.light"
          bg="theme.grey"
          fontWeight={400}
          _hover={{ bg: 'theme.mediumGrey' }}
          _active={{ bg: 'theme.mediumGrey' }}
          type="button"
          size="lg"
          onClick={handleSuggest}
          isLoading={isLoading}
        >
          Suggest
        </Button>
        <Button
          color="theme.light"
          bg="theme.grey"
          size="lg"
          fontWeight={400}
          _hover={{ bg: 'theme.mediumGrey' }}
          _active={{ bg: 'theme.mediumGrey' }}
          type="submit"
        >
          Add Recipe
        </Button>
      </Flex>
    </Box>
  );
}

export default function NewRecipe() {
  const toast = useToast();
  const router = useRouter();
  const handleSubmit = async (values: typeof initialValues) => {
    await axios.post('/api/recipes', values);
    toast({
      title: `Created ${values.name}`,
      status: 'success',
    });
    router.push('/recipes');
  };
  const initialValues = {
    name: 'Blueberry chocolate',
    imageURL: '',
    description: '',
    ingredients: '',
    directions: '',
    price: 10,
    image: '100',
  };

  return (
    <Sidebar>
      <Box px={10} py={8}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          component={CreateRecipeForm}
        />
      </Box>
    </Sidebar>
  );
}
