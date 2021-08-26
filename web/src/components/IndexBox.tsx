import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface IndexBoxProps {
  children?: ReactNode;
}

export const IndexBox: React.FC<IndexBoxProps & Record<string, any>> = ({
  children,
  ...rest
}) => {
  return (
    <Flex
      p="4"
      my="4"
      mb="12"
      minHeight="450px"
      flexDirection="column"
      justifyContent="center"
      {...rest}
    >
      {children}
    </Flex>
  );
};
