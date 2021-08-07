import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
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
import { moneyFormatter } from "../utils/moneyFormatter";

export const NavBar: React.FC<{}> = ({}) => {
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
      <Flex alignItems="center">
        <NextLink href="/register">
          <Button mr={5} variant="solid" colorScheme="yellow" width={"120px"}>
            register
          </Button>
        </NextLink>
        <NextLink href="/login">
          <Button variant="ghost" mr={2} width={"120px"}>
            login
          </Button>
        </NextLink>
      </Flex>
    );
  }
  // user is logged in
  else {
    body = (
      <Flex alignItems="center" textAlign={"center"}>
        <Box mr={5} width={"120px"} color={"gray.400"} fontWeight={"semibold"}>
          {moneyFormatter(data.me.money)}
        </Box>
        <Menu>
          <MenuButton
            mr={2}
            width={"120px"}
            as={Button}
            color={"gray.300"}
            rightIcon={<ChevronDownIcon />}
          >
            Account
          </MenuButton>
          <MenuList minW="0" w={"190px"}>
            <MenuItem isDisabled={true} color={"white"}>
              <Box ml={"auto"}>{data.me.username}</Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
              }}
              isLoading={logoutFetching}
              color={"gray.500"}
              variant="ghost"
            >
              <Box ml={"auto"}>logout</Box>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      as={"nav"}
      bg={"#1A202D"}
      p={3}
      alignItems={"center"}
      position={"sticky"}
      top={"0"}
    >
      <Flex paddingLeft={"35px"}>
        <NextLink href="/">
          <Link mr={2}>
            <Heading
              as={"h2"}
              size={"lg"}
              color="lightyellow"
              textShadow="
              0 0 7px yellow,
              0 0 14px orange"
              filter={"saturate(60%)"}
            >
              BIG BOY GAMBLE TIME
            </Heading>
          </Link>
        </NextLink>
      </Flex>
      <Box ml={"auto"} paddingRight={"1.1vw"}>
        {body}
      </Box>
    </Flex>
  );
};
