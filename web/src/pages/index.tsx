import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index: React.FC<{}> = ({}) => {
  const boxes = [];
  for (let i = 0; i < 4; i++) {
    boxes.push(
      <Box
        borderWidth="4px"
        borderStyle="dashed"
        rounded="md"
        h="96"
        p="4"
        my="4"
        key={i}
      >
        Index{i}
      </Box>
    );
  }

  return (
    <>
      <InterfaceUI>
        <Box>
          <Box minHeight={"100vh"}>{boxes}</Box>
        </Box>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
