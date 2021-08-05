import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Blackjack: React.FC<{}> = ({}) => {
  return (
    <>
      <NavBar />
      <div>Blackjack</div>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Blackjack);
