import { extendTheme } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";
import "@fontsource/ubuntu/700.css";
import "@fontsource/open-sans";

const customTheme = extendTheme({
  ...theme,
  colors: {
    brand: {
      100: "#16161D",
      200: "#1D161D",
      300: "#161d1d",
      400: "#ADD8E6",
    },
  },
  fonts: {
    heading: "Ubuntu",
    body: "Open Sans",
    mono: "Menlo, monospace",
  },
});

export default customTheme;
