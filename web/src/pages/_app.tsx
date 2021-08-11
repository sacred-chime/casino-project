import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import React from "react";
import customTheme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={customTheme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
