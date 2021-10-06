import React, { useContext } from "react";
import { faCannabis, faListAlt, faQrcode, faSignOutAlt, faSquare, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Divider, Stack } from "@mui/material";
import { useHistory } from "react-router";
import Context from "../context/Context";
import Page from "./Page";

export default function Home() {
  const context = useContext(Context);
  let history = useHistory();

  return (
    <Page title="Home">
      <Stack spacing={2}>
        {context.isLogged?
          <>
            <Divider>
              <Chip label="Menú Administrador" color="primary"/>
            </Divider>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/create")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faUserPlus} transform="shrink-6 left-1"/>
              </span>
              <span>Nuevo Participante</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Listado Participantes</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{context.logout()}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Cerrar Sesión</span>
            </Button>
          </>
          :context.isParticipanteLogged?
            <Button variant="outlined" sx={{alignItems: "center", flexDirection: "column"}} onClick={(e)=>{history.push("/calificacion")}} >
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
              </span>
              <span>Calificar Muestra</span>
            </Button>
          :
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/login")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faUser} transform="shrink-6 left-1"/>
                <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
              </span>
              <span>Ingresar</span>
            </Button>
        }
      </Stack>
    </Page>
  );
}
