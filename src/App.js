import "./App.css";
import axios from "axios";
import ContextProvider from "./context/ContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { blueGrey, deepOrange, grey, red } from "@mui/material/colors";

//axios.defaults.baseURL = "https://codelo-cup-api.herokuapp.com/";
axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("status", error.response.status);
  if(error.response.status===403){
    window.location.href = "/codelo-cup";
  }
  return Promise.reject(error);
});

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: blueGrey[900],
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: deepOrange[500],
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
})

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router basename={'/codelo-cup'}>
        <ContextProvider>
          <Routes/>
        </ContextProvider>
      </Router>
    </ThemeProvider>
  );
}
