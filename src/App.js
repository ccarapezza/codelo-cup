import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import axios from "axios";
import Calificacion from "./pages/calificacion/Calificacion";
import CreateParticipante from "./pages/participante/CreateParticipante";
import ListParticipante from "./pages/participante/ListParticipante";
import AdminLogin from "./pages/AdminLogin";
import ContextProvider from "./context/ContextProvider";

//axios.defaults.baseURL = "https://codelo-cup-api.herokuapp.com/";
axios.defaults.baseURL = "http://localhost:8080/";
//axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

export default function App() {
  return (
    <Router>
      <ContextProvider>
        <div>
          <Switch>
            <Route path="/admin">
              <AdminLogin />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/calificacion/:hash">
              <Calificacion />
            </Route>
            <Route path="/participante/create">
              <CreateParticipante />
            </Route>
            <Route path="/participante/list">
              <ListParticipante />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </ContextProvider>
    </Router>
  );
}
