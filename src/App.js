import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import axios from "axios";
import Calificacion from "./pages/calificacion/Calificacion";
import CreateParticipante from "./pages/participante/CreateParticipante";

axios.defaults.baseURL = "https://codelo-cup-api.herokuapp.com/";
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
          <Route path="/calificacion/:hash">
            <Calificacion />
          </Route>
          <Route path="/participante/create">
            <CreateParticipante />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
