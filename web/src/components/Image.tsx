import { Box, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import React, { ReactNode } from "react";

interface ImageProps {
  src: string;
  caption: string;
  href?: string;
}

export const Image: React.FC<ImageProps> = ({ src, caption, href }) => {
  return (
    <ConditionalWrapper
      condition={href!}
      wrapper={(children) => <NextLink href={href!}>{children}</NextLink>}
    >
      <Box
        color={"white"}
        position={"relative"}
        width={"26vw"}
        height={"26.5vh"}
        borderRadius={"8px"}
        overflow={"hidden"}
      >
        <Box
          background={
            "linear-gradient(rgba(255, 255, 255, 0) 40%, rgba(0, 0, 0, 1))"
          }
          width={"100%"}
          height={"100%"}
          position={"absolute"}
          top={"0"}
          left={"0"}
          zIndex={"10"}
        />
        <NextImage
          src={src}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />

        <Text
          position={"absolute"}
          textTransform={"capitalize"}
          fontFamily={"heading"}
          fontSize={"lg"}
          left={"20px"}
          bottom={"20px"}
          zIndex={"20"}
        >
          {caption}
        </Text>
      </Box>
    </ConditionalWrapper>
  );
};

interface ConditionalWrapperProps {
  condition: string;
  wrapper: (children: ReactNode) => JSX.Element;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => {
  return condition ? wrapper(children) : children;
};
