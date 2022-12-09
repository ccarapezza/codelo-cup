import { faBong, faExclamation, faExclamationCircle, faJoint, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Typography } from "@mui/material";
import React from "react";
import Page from "./Page";

export default function ServerDownPage() {
  return (
    <Page footer={false}>
      <Stack sx={{ display: "flex", alignItems: "center" }}>
        <div className="fa-layers fa-fw fa-10x">
          <FontAwesomeIcon icon={faSquare} />
          <FontAwesomeIcon icon={faSquare} inverse transform="shrink-1" />
          <FontAwesomeIcon icon={faBong} transform="shrink-4" />
          <FontAwesomeIcon icon={faExclamationCircle} transform="shrink-10 down-3 left-1"/>
          <FontAwesomeIcon icon={faExclamation} inverse transform="shrink-12 down-3 left-1"/>
        </div>
        <Typography variant="h4" sx={{textAlign: "center"}}>Hay problemas con el servidor, intente nuevamente en un momento o contacte a un adminsitrador.</Typography>
      </Stack>
    </Page>
  );
}