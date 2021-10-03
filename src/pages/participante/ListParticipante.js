
import { AccountCircle } from "@material-ui/icons";
import { Avatar, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis } from '@fortawesome/free-solid-svg-icons'

export default function ListParticipante() {
  const [participantes, setParticipantes] = useState([]);

  const listAllParticipantes = () => {
    setParticipantes();
    axios.get("/api/participante/list")
    .then(function (response) {
      // handle success
      console.log(response);
      if(response.status === 200){
        setParticipantes(response.data);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  };

  useEffect(() => {
    listAllParticipantes();
  }, []);

  return (
    <Page title="Nuevo Participante" footer={false}>
      
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {participantes?.map((participante)=>{
            return(
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                  primary={participante.name} 
                  secondary={
                    <React.Fragment>
                      {participante.muestras?.map((muestra)=>
                        <Chip sx={{pl: "5px", mr: 1}} icon={<FontAwesomeIcon icon={faCannabis} />} label={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} />
                      )}
                    </React.Fragment>
                  }
                  />
                </ListItem>
                <Divider/>
              </>
            )
          })}
        </List>
    </Page>
  );
}
