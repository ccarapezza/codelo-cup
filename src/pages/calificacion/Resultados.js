
import { AccountCircle } from "@material-ui/icons";
import { Avatar, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis } from '@fortawesome/free-solid-svg-icons'

export default function ListParticipante() {
  const [calificaciones, setCalificaciones] = useState([]);

  const obtenerResultados = () => {
    setCalificaciones();
    
  };

  useEffect(() => {
    axios.get("/api/calificaciones/resultados")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCalificaciones(response.data?.calificaciones);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }, []);

  return (
    <Page title="Nuevo Participante" footer={false}>
      
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {participantes?.map((participante)=>{
            return(
              <div key={participante.hash}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participante.name} 
                    secondary={participante.muestras?.map((muestra)=>
                      <Chip
                        key={muestra.hash}
                        component="span"
                        sx={{pl: "5px", mr: 1}}
                        icon={<FontAwesomeIcon
                          icon={faCannabis} />
                        }
                        label={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} />
                    )}
                  />
                </ListItem>
                <Divider />
              </div>
            )
          })}
        </List>
    </Page>
  );
}
