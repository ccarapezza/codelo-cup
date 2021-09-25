import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import axios from "axios";

axios.defaults.baseURL = "https://192.168.0.5:8080";
//axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
