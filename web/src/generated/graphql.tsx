import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bet = {
  __typename?: "Bet";
  id: Scalars["Float"];
  playerId: Scalars["Float"];
  player: User;
  game: Scalars["String"];
  wager: Scalars["Float"];
  payout: Scalars["Float"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
  creator: User;
};

export type BetInput = {
  game: Scalars["String"];
  wager: Scalars["Float"];
  payout: Scalars["Float"];
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createBet: Bet;
  changePassword: UserResponse;
  forgotPassword: Scalars["Boolean"];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars["Boolean"];
  changeFunds: UserResponse;
};

export type MutationCreateBetArgs = {
  input: BetInput;
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars["String"];
  token: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  usernameOrEmail: Scalars["String"];
};

export type MutationChangeFundsArgs = {
  fundDelta: Scalars["Float"];
};

export type PaginatedBets = {
  __typename?: "PaginatedBets";
  bets: Array<Bet>;
  hasMore: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  bets: PaginatedBets;
  bet?: Maybe<Bet>;
  hello: Scalars["String"];
  me?: Maybe<User>;
};

export type QueryBetsArgs = {
  cursor?: Maybe<Scalars["String"]>;
  limit: Scalars["Int"];
};

export type QueryBetArgs = {
  id: Scalars["Float"];
};

export type User = {
  __typename?: "User";
  id: Scalars["Float"];
  username: Scalars["String"];
  email: Scalars["String"];
  money: Scalars["Float"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars["String"];
  username: Scalars["String"];
  password: Scalars["String"];
};

export type StandardErrorFragment = { __typename?: "FieldError" } & Pick<
  FieldError,
  "field" | "message"
>;

export type StandardUserFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username" | "money"
>;

export type StandardUserReponseFragment = { __typename?: "UserResponse" } & {
  errors?: Maybe<Array<{ __typename?: "FieldError" } & StandardErrorFragment>>;
  user?: Maybe<{ __typename?: "User" } & StandardUserFragment>;
};

export type ChangeFundsMutationVariables = Exact<{
  fundDelta: Scalars["Float"];
}>;

export type ChangeFundsMutation = { __typename?: "Mutation" } & {
  changeFunds: { __typename?: "UserResponse" } & StandardUserReponseFragment;
};

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars["String"];
  newPassword: Scalars["String"];
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
  changePassword: { __typename?: "UserResponse" } & StandardUserReponseFragment;
};

export type CreateBetMutationVariables = Exact<{
  input: BetInput;
}>;

export type CreateBetMutation = { __typename?: "Mutation" } & {
  createBet: { __typename?: "Bet" } & Pick<
    Bet,
    "id" | "createdAt" | "game" | "wager" | "payout" | "playerId"
  >;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "forgotPassword"
>;

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "UserResponse" } & StandardUserReponseFragment;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "UserResponse" } & StandardUserReponseFragment;
};

export type BetsQueryVariables = Exact<{
  limit: Scalars["Int"];
  cursor?: Maybe<Scalars["String"]>;
}>;

export type BetsQuery = { __typename?: "Query" } & {
  bets: { __typename?: "PaginatedBets" } & Pick<PaginatedBets, "hasMore"> & {
      bets: Array<
        { __typename?: "Bet" } & Pick<
          Bet,
          "id" | "createdAt" | "game" | "wager" | "payout" | "playerId"
        >
      >;
    };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<{ __typename?: "User" } & StandardUserFragment>;
};

export const StandardErrorFragmentDoc = gql`
  fragment StandardError on FieldError {
    field
    message
  }
`;
export const StandardUserFragmentDoc = gql`
  fragment StandardUser on User {
    id
    username
    money
  }
`;
export const StandardUserReponseFragmentDoc = gql`
  fragment StandardUserReponse on UserResponse {
    errors {
      ...StandardError
    }
    user {
      ...StandardUser
    }
  }
  ${StandardErrorFragmentDoc}
  ${StandardUserFragmentDoc}
`;
export const ChangeFundsDocument = gql`
  mutation changeFunds($fundDelta: Float!) {
    changeFunds(fundDelta: $fundDelta) {
      ...StandardUserReponse
    }
  }
  ${StandardUserReponseFragmentDoc}
`;

export function useChangeFundsMutation() {
  return Urql.useMutation<ChangeFundsMutation, ChangeFundsMutationVariables>(
    ChangeFundsDocument
  );
}
export const ChangePasswordDocument = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      ...StandardUserReponse
    }
  }
  ${StandardUserReponseFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const CreateBetDocument = gql`
  mutation CreateBet($input: BetInput!) {
    createBet(input: $input) {
      id
      createdAt
      game
      wager
      payout
      playerId
    }
  }
`;

export function useCreateBetMutation() {
  return Urql.useMutation<CreateBetMutation, CreateBetMutationVariables>(
    CreateBetDocument
  );
}
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      ...StandardUserReponse
    }
  }
  ${StandardUserReponseFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
export const RegisterDocument = gql`
  mutation Register($options: UsernamePasswordInput!) {
    register(options: $options) {
      ...StandardUserReponse
    }
  }
  ${StandardUserReponseFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
export const BetsDocument = gql`
  query Bets($limit: Int!, $cursor: String) {
    bets(cursor: $cursor, limit: $limit) {
      hasMore
      bets {
        id
        createdAt
        game
        wager
        payout
        playerId
      }
    }
  }
`;

export function useBetsQuery(
  options: Omit<Urql.UseQueryArgs<BetsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<BetsQuery>({ query: BetsDocument, ...options });
}
export const MeDocument = gql`
  query Me {
    me {
      ...StandardUser
    }
  }
  ${StandardUserFragmentDoc}
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
