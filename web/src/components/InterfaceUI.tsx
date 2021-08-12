import { Box, Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { SideBar } from "./SideBar";

interface InterfaceUIProps {
  children?: ReactNode;
}

export const InterfaceUI: React.FC<InterfaceUIProps> = ({ children }) => {
  return (
    <>
      <Flex minH={"100vh"} width={"100%"}>
        <SideBar />
        <Box minH={"100vh"} width={"100%"}>
          <NavBar />
          <Box px={"12"} pt={"2"}>
            {children}
          </Box>
        </Box>
      </Flex>
    </>
  );
};
