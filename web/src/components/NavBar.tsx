import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
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
          <Button mr={5} variant="solid" colorScheme="yellow">
            register
          </Button>
        </NextLink>
        <NextLink href="/login">
          <Button variant="ghost" mr={2}>
            login
          </Button>
        </NextLink>
      </Flex>
    );
  }
  // user is logged in
  else {
    body = (
      <Flex alignItems="center">
        <Box mr={5}>{moneyFormatter(data.me.money)}</Box>
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
            <Heading as={"h2"} size={"lg"}>
              BIG BOY GAMBLE TIME
            </Heading>
          </Link>
        </NextLink>
      </Flex>
      <Box ml={"auto"} paddingRight={"4vw"}>
        {body}
      </Box>
    </Flex>
  );
};
