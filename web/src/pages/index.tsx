import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { useBetsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { moneyFormatter } from "../utils/moneyFormatter";

const Index: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useBetsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <>
      <InterfaceUI>
        <Box>
          <Box minHeight={"100vh"}>
            {!data && fetching ? (
              <div>loading...</div>
            ) : (
              data!.bets.bets.map((b) => (
                <Box
                  borderWidth="4px"
                  borderStyle="dashed"
                  rounded="md"
                  h="96"
                  p="4"
                  my="4"
                  key={b.id}
                >
                  <p>Game: {b.game}</p>
                  <p>Wager: {moneyFormatter(b.wager)}</p>
                  <p>
                    Multiplier: {Math.round((b.payout * 10) / b.wager) / 10}x
                  </p>
                  <p>Payout: {moneyFormatter(b.payout)}</p>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
