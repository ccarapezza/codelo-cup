import "./App.css";
import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calificacion from "./pages/calificacion/Calificacion";
import CreateParticipante from "./pages/participante/CreateParticipante";
import ListParticipante from "./pages/participante/ListParticipante";
import AdminLogin from "./pages/AdminLogin";
import Context from "./context/Context";
import NotFoundPage from "./pages/NotFoundPage";
import Resultados from "./pages/calificacion/Resultados";
import QrListParticipantes from "./pages/participante/QrListParticipantes";
import QrListMuestra from "./pages/participante/QrListMuestra";
import MesasManager from "./pages/mesa/MesasManager";
import EditParticipante from "./pages/participante/EditParticipante";
import ConsultaCalificacion from "./pages/calificacion/ConsultaCalificacion";
import ListDojo from "./pages/dojo/ListDojo";
import ListCategoria from "./pages/categoria/ListCategoria";
import Summary from "./pages/Summary";
import CreateJurado from "./pages/participante/CreateJurado";
import ListJurado from "./pages/participante/ListJurado";
import SummaryCalificaciones from "./pages/SummaryCalificaciones";
import ListMuestra from "./pages/muestra/ListMuestra";
import ChangeAdminPassword from "./pages/admin/ChangeAdminPassword";
import Configuration from "./pages/admin/Configuration";
import ServerDownPage from "./pages/ServerDownPage";

export default function Routes() {
  const context = useContext(Context);

  if (!context.isLogged&&!context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Switch>
          <Route path="/admin">
            <AdminLogin />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/server-down">
            <ServerDownPage />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*" component={NotFoundPage} />
      </Switch>
    );
  }

  if (context.isLogged&&!context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Switch>
          <Route path="/participante/create">
            <CreateParticipante />
          </Route>
          <Route path="/participante/create-jurado">
            <CreateJurado />
          </Route>
          <Route path="/participante/jurado-list">
            <ListJurado />
          </Route>
          <Route path="/participante/edit/:id?">
            <EditParticipante />
          </Route>
          <Route path="/calificaciones/resultados">
            <Resultados />
          </Route>
          <Route path="/calificaciones/muestra">
            <ConsultaCalificacion />
          </Route>
          <Route path="/participante/list">
            <ListParticipante />
          </Route>
          <Route path="/dojo/list">
            <ListDojo />
          </Route>
          <Route path="/categoria/list">
            <ListCategoria />
          </Route>
          <Route path="/participante/qr-list">
            <QrListParticipantes />
          </Route>
          <Route path="/summary-calificaciones">
            <SummaryCalificaciones />
          </Route>
          <Route path="/muestra/list">
            <ListMuestra />
          </Route>
          <Route path="/muestra/qr-list">
            <QrListMuestra />
          </Route>
          <Route path="/summary">
            <Summary />
          </Route>
          <Route path="/mesas-manager">
            <MesasManager />
          </Route>
          <Route path="/change-admin-pass">
            <ChangeAdminPassword />
          </Route>
          <Route path="/config">
            <Configuration />
          </Route>
          <Route path="/server-down">
            <ServerDownPage />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*" component={NotFoundPage} />
      </Switch>
    );
  }

  if (context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Switch>
        <Route path="/calificacion/:calificacionHash?">
          <Calificacion />
        </Route>
        <Route path="/login">
            <Login />
          </Route>
        <Route path="/server-down">
            <ServerDownPage />
          </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*" component={NotFoundPage} />
      </Switch>
    );
  }

  if (context.isJuradoLogged) {
    return (
      <Switch>
        <Route path="/calificaciones/muestra">
          <ConsultaCalificacion />
        </Route>
        <Route path="/calificacion/:calificacionHash?">
          <Calificacion />
        </Route>
        <Route path="/server-down">
          <ServerDownPage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*" component={NotFoundPage} />
      </Switch>
    );
  }
}
