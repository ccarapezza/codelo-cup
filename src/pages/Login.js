import { faCamera, faSquareFull, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, CardHeader, IconButton, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import QrReader from "react-qr-reader";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import Context from "../context/Context";
import Page from "./Page";

export default function Login() {
  const context = useContext(Context);
  const history = useHistory();
  const [camera, setCamera] = useState("environment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const switchCamera = () => {
      setCamera(camera==="environment"?"user":"environment");
  };

  const handleScan = (data) => {
    if (data) {
      setLoading(true)
      context.participanteLogin(data)
      .catch(function (error) {
        context.showMessage("No se ha encontrado el Participante. Contacte con el administrador.", "error");
        history.push("/");
        console.error(error);
      }).then(function (response) {
        setLoading(false);
      })
    }
  };

  const handleError = (err) => {
    setError(err);
    setLoading(false);
    console.error(err);
  };

  return (
    <Page title="Ingresar Participante">
      <Stack>
        {!error && (
          <Card>
            <CardHeader
              sx={{pb:0}}
              subheader="Escaneé el código de su credencial para comenzar a calificar"
              action={
                <IconButton aria-label="settings" onClick={(e)=>{switchCamera()}}>
                  <span className="fa-layers fa-fw fa-2x fa-dark">
                    <FontAwesomeIcon icon={faCamera}/>
                    <FontAwesomeIcon icon={faSquareFull} transform="shrink-4 down-1"/>
                    <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-8 down-1"/>
                  </span>
                </IconButton>
              } />
            <CardContent>
              {/* 
                <div>
                  <input type="text" value={hash} onChange={(e)=>{setHash(e.target.value)}} />
                  <button onClick={(e)=>{context.participanteLogin(hash)}}>Login</button>
                </div>
                <div>QR RESULT:{hash}</div>
                <div>{JSON.stringify(error)}</div>
              */}
              {!loading?
                <QrReader
                  facingMode={camera}
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                  />
              :
                <Loading/>
              }
            </CardContent>
        </Card>
        )}
      </Stack>
    </Page>
  );
}
