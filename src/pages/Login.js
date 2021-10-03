import { Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import QrReader from "react-qr-reader";
import Context from "../context/Context";
import Page from "./Page";

export default function Login() {
  const context = useContext(Context);

  const [hash, setHash] = useState();
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    setError(err);
    console.error(err);
  };

  return (
    <Page title="Ingresar Participante">
      <Stack>
        {!result && (
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        )}
        <p>
          <input type="text" value={hash} onChange={(e)=>{setHash(e.target.value)}} />
          <button onClick={(e)=>{context.participanteLogin(hash)}}>Login</button>
        </p>
        <p>QR RESULT:{result}</p>
        <p>{JSON.stringify(error)}</p>
      </Stack>
    </Page>
  );
}
