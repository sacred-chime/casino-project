import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const Slots: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <Box>Slots</Box>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Slots);
