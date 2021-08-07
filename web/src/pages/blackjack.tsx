import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";

const Blackjack: React.FC<{}> = ({}) => {
  return (
    <>
      <InterfaceUI>
        <div>Blackjack</div>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Blackjack);
