import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index: React.FC<{}> = ({}) => {
  return (
    <>
      <InterfaceUI>
        <Box>
          <Box minHeight={"100vh"}>Index</Box>
        </Box>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
