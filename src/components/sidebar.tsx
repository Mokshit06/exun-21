import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  FlexProps,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { MdWindow } from 'react-icons/md';

const Icons = {
  DASHBOARD: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 13L11.293 3.70697C11.6835 3.31659 12.3165 3.31659 12.707 3.70697L22 13H20V21C20 21.5523 19.5523 22 19 22H14V15H10V22H5C4.44772 22 4 21.5523 4 21V13H2Z"
        fill="currentColor"
      />
    </svg>
  ),
  KANBAN: <MdWindow size="28px" fontWeight={700} />,
};

const LinkItems = [
  // { name: 'Home', icon: FiHome },
  // { name: 'Trending', icon: FiTrendingUp },
  // { name: 'Explore', icon: FiCompass },
  // { name: 'Favourites', icon: FiStar },
  // { name: 'Settings', icon: FiSettings },
  {
    name: 'Dashboard',
    icon: Icons.DASHBOARD,
    href: '/dashboard',
  },
  {
    name: 'Kanban',
    icon: Icons.KANBAN,
    href: '/tasks',
  },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="theme.darkGrey">
      <SidebarContent
        onClose={() => onClose}
        // display={{ base: 'none', md: 'block' }}
      />
      {/* <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer> */}
      {/* <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} /> */}
      <Box ml={{ base: 0, md: 80 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

type SidebarProps = BoxProps & {
  onClose: () => void;
};

function SidebarContent({ onClose, ...props }: SidebarProps) {
  return (
    <Box
      bg="theme.grey"
      borderRight="1px"
      borderRightColor="theme.grey"
      w={{ base: 'full', md: 80 }}
      pos="fixed"
      p={4}
      h="full"
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Heading as="h3" fontSize="2xl" color="theme.light" fontWeight="bold">
          Logo
        </Heading>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex flexDir="column">
        {LinkItems.map(link => (
          <NavItem key={link.name} {...link}>
            {link.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
}

function NavItem(props: FlexProps & typeof LinkItems[number]) {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <NextLink href={props.href} passHref>
      <Flex
        gridGap={3}
        as="a"
        align="center"
        w="full"
        rounded="md"
        py={4}
        px={6}
        color={isActive ? 'theme.light' : 'theme.lightGrey'}
        bg={isActive ? 'theme.mediumGrey' : undefined}
      >
        {props.icon}
        <Text letterSpacing={0.4} fontSize="lg" fontWeight={600}>
          {props.children}
        </Text>
      </Flex>
    </NextLink>
  );
}
