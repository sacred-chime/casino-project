import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Icon,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaCcVisa, FaCcMastercard, FaBitcoin } from "react-icons/fa";
import { GiCherry } from "react-icons/gi";
import { MdGamepad, MdKeyboardArrowRight } from "react-icons/md";

export const SideBar: React.FC<{}> = ({}) => {
  const router = useRouter();
  const casino = useDisclosure();
  const miscGames = useDisclosure();
  return (
    <Box
      as="nav"
      height="100vh"
      w="240px"
      bg={"gray.900"}
      position={"sticky"}
      top={"0"}
    >
      <Flex
        flexDir="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
        height={"100%"}
      >
        <Box height={"10px"}></Box>
        <NavItem icon={GiCherry} onClick={casino.onToggle}>
          Casino
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={casino.isOpen ? "rotate(90deg)" : undefined}
          />
        </NavItem>
        <Collapse in={casino.isOpen}>
          <NextLink href="/blackjack">
            <NavItem pl="12" py="2">
              Blackjack
            </NavItem>
          </NextLink>
          <NextLink href="/slots">
            <NavItem pl="12" py="2">
              Slots
            </NavItem>
          </NextLink>
          <NextLink href="/roulette">
            <NavItem pl="12" py="2">
              Roulette
            </NavItem>
          </NextLink>
        </Collapse>
        <NavItem icon={MdGamepad} onClick={miscGames.onToggle}>
          Misc. Games
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={miscGames.isOpen ? "rotate(90deg)" : undefined}
          />
        </NavItem>
        <Collapse in={miscGames.isOpen}>
          <NextLink href="/minesweeper">
            <NavItem pl="12" py="2">
              Minesweeper
            </NavItem>
          </NextLink>
        </Collapse>
        <Box marginTop="auto" bg={"gray.700"} pb={"10%"}>
          <Center pt={"15px"}>
            <NextLink href="/add-funds">
              <Button
                colorScheme="grey"
                variant="outline"
                color="gray.500"
                width={"150px"}
              >
                <Text color={"gray.300"}>Add Funds</Text>
              </Button>
            </NextLink>
          </Center>

          <Center pt={"15px"}>
            <Flex width={"125px"}>
              <Icon w={8} h={8} color="goldenrod" as={FaCcVisa} />
              <Spacer />
              <Icon w={8} h={8} color="goldenrod" as={FaCcMastercard} />
              <Spacer />
              <Icon w={8} h={8} color="goldenrod" as={FaBitcoin} />
            </Flex>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};

const NavItem = (props: any) => {
  const { icon, children, ...rest } = props;
  return (
    <Flex
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      color={"gray.400"}
      _hover={{
        bg: "gray.900",
        color: "gray.200",
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      {...rest}
    >
      {icon && (
        <Icon
          mr="2"
          boxSize="4"
          _groupHover={{
            color: "gray.300",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};
