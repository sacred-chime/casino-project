import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { CarouselData } from "../components/ImageCarousel/CarouselData";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import { IndexBox } from "../components/IndexBox";
import { IndexHeader } from "../components/IndexHeader";
import { InterfaceUI } from "../components/InterfaceUI";
import { BetsQuery, useBetsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { moneyFormatter } from "../utils/moneyFormatter";

// MAIN INDEX PAGE COMPONENT
const Index: React.FC<{}> = ({}) => {
  const [variables, setVariables] = useState({
    hasBeenRendered: 10,
    limit: 10,
    cursor: null as null | string,
    offset: 0,
  });
  const [{ data, fetching, error }] = useBetsQuery({ variables });

  if (!fetching && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <>
      <InterfaceUI>
        <Box>
          <Box>
            {!data && fetching ? (
              <div>loading...</div>
            ) : (
              <>
                <IndexBox>
                  <ImageCarousel slides={CarouselData} />
                </IndexBox>
                <IndexBox>
                  <BetsTable
                    betData={data!}
                    fetching={fetching}
                    variables={variables}
                    setVariables={setVariables}
                  />
                </IndexBox>
              </>
            )}
          </Box>
        </Box>
      </InterfaceUI>
    </>
  );
};

// START OF ADDITIONAL COMPONENTS
interface betsTableProps {
  betData: BetsQuery;
  fetching: boolean;
  variables: {
    hasBeenRendered: number;
    limit: number;
    cursor: null | string;
    offset: number;
  };
  setVariables: React.Dispatch<
    React.SetStateAction<{
      hasBeenRendered: number;
      limit: number;
      cursor: string | null;
      offset: number;
    }>
  >;
}

const BetsTable: React.FC<betsTableProps> = ({
  betData,
  fetching,
  variables,
  setVariables,
}) => {
  return (
    <>
      <Box minHeight={"360px"}>
        <Center mb={"2"} width={"850px"} ml={"auto"} mr={"auto"}>
          <IndexHeader text={"ALL BETS"} />
        </Center>
        <Table
          variant={"unstyled"}
          size="sm"
          width={"850px"}
          ml={"auto"}
          mr={"auto"}
        >
          <Thead>
            <Tr>
              <Th width={"25%"}>Game</Th>
              <Th width={"25%"}>Player</Th>
              <Th width={"20%"} textAlign={"right"}>
                Wager
              </Th>
              <Th width={"10%"} textAlign={"right"}>
                Multiplier
              </Th>
              <Th width={"20%"} textAlign={"right"}>
                Payout
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {betData!.bets.bets
              .slice(variables.offset, variables.offset + variables.limit)
              .map((b) => (
                <Tr key={b.id}>
                  <Td>
                    {b.game.length > 15
                      ? b.game.substring(0, 15) + "..."
                      : b.game}
                  </Td>
                  <Td>
                    {b.player.username.length > 15
                      ? b.player.username.substring(0, 15) + "..."
                      : b.player.username}
                  </Td>
                  <Td textAlign={"right"}>{moneyFormatter(b.wager)}</Td>
                  <Td
                    textAlign={"right"}
                    color={b.payout / b.wager > 2 ? "#79d45a" : ""}
                    fontWeight={b.payout / b.wager > 2 ? "bold" : ""}
                  >
                    {(b.payout / b.wager).toFixed(2) + "x"}
                  </Td>
                  <Td
                    textAlign={"right"}
                    color={b.payout / b.wager > 2 ? "#79d45a" : ""}
                    fontWeight={b.payout / b.wager > 2 ? "bold" : ""}
                  >
                    {moneyFormatter(b.payout)}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Center mt={"2"}>
        <Flex alignItems="center">
          {betData ? (
            <Button
              onClick={() => {
                setVariables({
                  hasBeenRendered: betData!.bets.bets.length,
                  limit: variables.limit,
                  cursor: variables.cursor,
                  offset: variables.offset - variables.limit,
                });
              }}
              isLoading={fetching}
              isDisabled={variables.offset === 0}
            >
              <ChevronLeftIcon />
            </Button>
          ) : null}
          <Box mx={"4"}>{variables.offset / 10 + 1}</Box>
          {betData && betData.bets.hasMore ? (
            <Button
              onClick={() => {
                if (
                  variables.offset + variables.limit >=
                  variables.hasBeenRendered
                ) {
                  setVariables({
                    hasBeenRendered: betData!.bets.bets.length,
                    limit: variables.limit,
                    cursor:
                      betData!.bets.bets[betData!.bets.bets.length - 1]
                        .createdAt,
                    offset: variables.offset + variables.limit,
                  });
                } else {
                  setVariables({
                    hasBeenRendered: betData!.bets.bets.length,
                    limit: variables.limit,
                    cursor: variables.cursor,
                    offset: variables.offset + variables.limit,
                  });
                }
              }}
              isLoading={fetching}
            >
              <ChevronRightIcon />
            </Button>
          ) : null}
          {betData && betData.bets.bets.length % 10 !== 0 ? (
            <Button
              onClick={() => {
                setVariables({
                  hasBeenRendered: betData!.bets.bets.length,
                  limit: variables.limit,
                  cursor: variables.cursor,
                  offset: variables.offset + variables.limit,
                });
              }}
              isLoading={fetching}
              isDisabled={variables.offset + 10 >= betData.bets.bets.length}
            >
              <ChevronRightIcon />
            </Button>
          ) : null}
        </Flex>
      </Center>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
