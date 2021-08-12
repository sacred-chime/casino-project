import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { MoneyInputField } from "../components/MoneyInputField";
import { Wrapper } from "../components/Wrapper";
import { useChangeFundsMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";

const AddFunds: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [, changeFunds] = useChangeFundsMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ money: 0.0 }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changeFunds({ fundDelta: values.money });
          if (response.data?.changeFunds.errors) {
            setErrors(toErrorMap(response.data.changeFunds.errors));
          } else if (response.data?.changeFunds.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <MoneyInputField
              name="money"
              placeholder="0.00"
              label="Add Funds"
              type="number"
              min={1}
              step="any"
            />
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="purple"
            >
              add funds
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(AddFunds);
