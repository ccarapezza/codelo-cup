import "./App.css";
import axios from "axios";
import ContextProvider from "./context/ContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";

//axios.defaults.baseURL = "https://codelo-cup-api.herokuapp.com/";
axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

export default function App() {

  return (
    <Router basename={'/codelo-cup'}>
      <ContextProvider>
        <Routes/>
      </ContextProvider>
    </Router>
  );
}
