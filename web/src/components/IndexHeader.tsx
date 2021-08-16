import { Center, Heading } from "@chakra-ui/react";
import React from "react";

interface IndexHeaderProps {
  text: string;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({ text, ...rest }) => {
  return (
    <Center mb={"2"} width={"850px"} ml={"auto"} mr={"auto"}>
      <Heading
        mr={"auto"}
        as={"h2"}
        size={"md"}
        color="lightyellow"
        textShadow="
              0 0 7px yellow,
              0 0 14px orange"
        filter={"saturate(60%)"}
        {...rest}
      >
        {text}
      </Heading>
    </Center>
  );
};
