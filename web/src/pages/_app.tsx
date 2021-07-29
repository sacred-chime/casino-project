import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider>
      <ColorModeProvider
        options={{
          initialColorMode: "light",
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
