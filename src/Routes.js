import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import axios from "axios";
import Calificacion from "./pages/calificacion/Calificacion";
import CreateParticipante from "./pages/participante/CreateParticipante";
import ListParticipante from "./pages/participante/ListParticipante";
import AdminLogin from "./pages/AdminLogin";
import { useContext } from "react";
import Context from "./context/Context";
import NotFoundPage from "./pages/NotFoundPage";
import Resultados from "./pages/calificacion/Resultados";
import QrListParticipantes from "./pages/participante/QrListParticipantes";
import QrListMuestra from "./pages/participante/QrListMuestra";
import MesasManager from "./pages/mesa/MesasManager";

//axios.defaults.baseURL = "https://codelo-cup-api.herokuapp.com/";
axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

export default function Routes() {
  const context = useContext(Context);

  return (
    <Switch>
      <Route path="/admin">
        <AdminLogin />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/calificacion/:calificacionHash?">
        
        {context.isParticipanteLogged?
          <Calificacion />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/participante/create">
        {context.isLogged?
          <CreateParticipante />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/calificaciones/resultados">
        {context.isLogged?
          <Resultados />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/participante/list">
        {context.isLogged?
          <ListParticipante />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/participante/qr-list">
        {context.isLogged?
          <QrListParticipantes />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/muestra/qr-list">
        {context.isLogged?
          <QrListMuestra />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/mesas-manager">
        {context.isLogged?
          <MesasManager />
        :
          <Redirect to="/404" />
        }
      </Route>
      <Route path="/404" component={NotFoundPage}/>
      <Route path="/">
        <Home />
      </Route>
      <Redirect to="/404" />
    </Switch>
  );
}
