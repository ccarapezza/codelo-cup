import { faCamera, faSquareFull, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, CardHeader, IconButton, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import QrReader from "react-qr-reader";
import Loading from "../components/Loading";
import Context from "../context/Context";
import Page from "./Page";

export default function Login() {
  const context = useContext(Context);
  const [camera, setCamera] = useState("environment");
  const switchCamera = () => {
      setCamera(camera==="environment"?"user":"environment");
  };

  const [hash, setHash] = useState();
  const [error, setError] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setHash(data)
      context.participanteLogin(data)
    }
  };

  const handleError = (err) => {
    setError(err);
    console.error(err);
  };

  return (
    <Page title="Ingresar Participante">
      <Stack>
        {!error && (
          <Card>
            <CardHeader
              sx={{pb:0}}
              subheader="Escanee el codigo de su credencial para comenzar a calificar"
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
              {!hash?
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
