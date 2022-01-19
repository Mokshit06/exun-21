import Navbar from '@/components/navbar';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const f = `Inter`;

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const handleNavigation = () => {
    router.push({
      pathname: '/register',
      query: { email },
    });
  };

  return (
    <Box
      minH="100vh"
      bgImage="url(/hero.jpg)"
      bgPosition="center"
      bgSize="cover"
      w="full"
      overflowX="hidden"
    >
      <Navbar />
      <Box maxW="900px" ml="8rem" mt="3rem">
        <Heading mb={10} fontFamily={f} fontSize="7xl" fontWeight={800}>
          Manage Willy&apos;s chocolate factory with ease
        </Heading>
        <Flex maxW="600px">
          <Input
            placeholder="john@doe.com"
            // rounded="lg"
            bg="rgb(30 41 59/1)"
            border="none"
            h={14}
            shadow="lg"
            fontSize="lg"
            px={6}
            _focus={{ border: 'none' }}
            value={email}
            onChange={e => setEmail(e.target.value)}
            borderRadius="var(--chakra-radii-lg) 0 0 var(--chakra-radii-lg)"
          />
          <Button
            bg="rgb(14 165 233/1)"
            px={8}
            fontSize="md"
            _active={{
              bg: 'rgb(56 189 248/1)',
            }}
            _hover={{
              bg: 'rgb(56 189 248/1)',
            }}
            h={14}
            onClick={handleNavigation}
            borderRadius=" 0 var(--chakra-radii-lg) var(--chakra-radii-lg) 0"
          >
            Start now
          </Button>
        </Flex>
      </Box>
      <Box overflowY="visible" mt="3rem">
        <Grid
          ml="-5%"
          templateColumns="repeat(4, 1fr)"
          w="110%"
          columnGap={10}
          rowGap={3}
        >
          <TaskPreview />
          <TaskPreview />
          <Flex
            p={4}
            rounded="lg"
            shadow="lg"
            // bg="rgb(30 41 59/1)"
            backdropFilter="blur(8px) brightness(1.2)"
            border="2px solid rgb(30 41 59/1)"
            // w="110%"
            // ml="-5%"
            // transform="translateY(-2rem)"
            justify="space-between"
            gridGap={8}
          >
            <Box h="full" w="full">
              <Text mb={2} fontSize="lg">
                How to use the machines in the Testing room?
              </Text>
              <Tag
                bg="rgb(14 165 233/0.8)"
                color="theme.light"
                variant="subtle"
              >
                Testing Room
              </Tag>
            </Box>
            <Flex h="full" alignItems="flex-end">
              <Avatar name="Jane Doe" src="" size="sm" />
            </Flex>
          </Flex>
          <TaskPreview />
          <TaskPreview />
          <TaskPreview />
          <Box />
          {/* <TaskPreview /> */}
          <TaskPreview />
          <Box />
          <TaskPreview />
          <Box />
          <TaskPreview />
        </Grid>
      </Box>
    </Box>
  );
}

function TaskPreview() {
  return (
    <Flex
      p={4}
      rounded="lg"
      shadow="xl"
      // bg="rgb(30 41 59/1)"
      backdropFilter="blur(8px) brightness(1.2)"
      border="2px solid rgb(30 41 59/1)"
      w="full"
      justify="space-between"
      gridGap={8}
    >
      <Box h="full" w="full">
        <Box mb={3} height={4} w="full" bg="rgb(30 41 59/1)" rounded="md" />
        <Box
          height={3}
          w="50%"
          bg="rgb(30 41 59/1)"
          rounded="md"
          opacity={0.7}
        />
      </Box>
      <Flex h="full" alignItems="flex-end">
        <Box h={5} w={5} rounded="full" bg="rgb(30 41 59/1)" />
      </Flex>
    </Flex>
  );
}
