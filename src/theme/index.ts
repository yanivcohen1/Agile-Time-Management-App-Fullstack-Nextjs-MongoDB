import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8E44FF"
    },
    secondary: {
      main: "#2ECC71"
    },
    background: {
      default: "#09090b",
      paper: "#111113"
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    fontFamily: "var(--font-rubik, 'Rubik', system-ui)"
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained"
      }
    }
  }
});

export default theme;
