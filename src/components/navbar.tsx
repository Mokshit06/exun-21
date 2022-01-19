import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      py={3}
      px={10}
      h="10vh"
      w="100vw"
      fontFamily="Inter"
    >
      <Text fontWeight={500} fontSize="2xl" color="theme.light">
        Oompas
      </Text>
      <Flex fontWeight={500} fontSize="sm" gridGap={10}>
        <Link href="/" passHref>
          <Text as="a" fontSize="md" color="theme.light">
            Home
          </Text>
        </Link>
        <Link href="/login" passHref>
          <Text as="a" fontSize="md" color="theme.light">
            Login
          </Text>
        </Link>
        <Link href="/register" passHref>
          <Text as="a" fontSize="md" color="theme.light">
            Register
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}
