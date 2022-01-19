import Navbar from '@/components/navbar';
import {
  Box,
  Heading,
  Input,
  Flex,
  FormLabel,
  FormControl,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget!);
    await axios.post('/api/auth/login', {
      email: formData.get('email'),
      password: formData.get('password'),
    });

    toast({
      title: "You're logged in!",
      status: 'success',
      variant: 'subtle',
      containerStyle: { color: 'black' },
    });

    router.push('/tasks');
  };

  return (
    <Flex
      minH="100vh"
      bgImage="url(/hero.jpg)"
      bgPosition="center"
      bgSize="cover"
      w="full"
      flexDir="column"
      alignItems="center"
    >
      <Navbar />
      <Box maxW="900px" mt="3rem">
        <Heading mb={6} fontSize="5xl" fontWeight={800}>
          Login
        </Heading>
        <Box
          as="form"
          onSubmit={handleSubmit as any}
          backdropFilter="blur(8px) brightness(0.9) "
          px={5}
          py={6}
          rounded="lg"
          shadow="lg"
          minW="500px"
          d="flex"
          flexDir="column"
          gridGap={4}
          border="2px solid rgb(30 41 59/1)"
        >
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="john@doe.com"
              rounded="md"
              bg="rgb(30 41 59/1)"
              border="none"
              h={12}
              name="email"
              type="email"
              fontSize="lg"
              defaultValue={router.query.email || ''}
              px={6}
              _focus={{ border: 'none' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="j#hn_do*"
              bg="rgb(30 41 59/1)"
              border="none"
              h={12}
              type="password"
              name="password"
              rounded="md"
              fontSize="lg"
              px={6}
              _focus={{ border: 'none' }}
            />
          </FormControl>
          <Button
            mt={2}
            bg="rgb(14 165 233/1)"
            px={8}
            fontSize="md"
            _active={{
              bg: 'rgb(56 189 248/1)',
            }}
            _hover={{
              bg: 'rgb(56 189 248/1)',
            }}
            h={12}
            type="submit"
            rounded="lg"
          >
            Login
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}
