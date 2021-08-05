import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  // data is loading
  if (fetching) {
  }
  // user not logged in
  else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </Flex>
    );
  }
  // user is logged in
  else {
    body = (
      <Flex alignItems="center">
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="ghost"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="skyblue" p={4} alignItems="center">
      <NextLink href="/">
        <Link mr={2}>Big Boy Gamble Time</Link>
      </NextLink>
      <Box ml={"auto"}>
        <Center>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              backgroundColor="powderblue"
            >
              Games
            </MenuButton>
            <MenuList backgroundColor="steelblue">
              <NextLink href="/slots">
                <MenuItem color="white">Slots</MenuItem>
              </NextLink>
              <NextLink href="/blackjack">
                <MenuItem color="white">Blackjack</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Center>
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
