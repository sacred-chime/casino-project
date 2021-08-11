import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const Craps: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <div>Craps</div>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Craps);
