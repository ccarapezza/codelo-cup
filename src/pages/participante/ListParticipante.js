
import { Avatar, Button, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis, faEdit } from '@fortawesome/free-solid-svg-icons'
import { orange, green } from '@mui/material/colors';
import { useHistory } from "react-router";
import { Box } from "@mui/system";

export default function ListParticipante() {
  const [participantes, setParticipantes] = useState([]);
  let history = useHistory();

  const listAllParticipantes = () => {
    setParticipantes();
    axios.get("/api/participante/list")
    .then(function (response) {
      // handle success
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
    <Page title="Listado Participantes" footer={false}>
      <List sx={{paddingTop: "0", marginTop: 0}}>
        {participantes?.map((participante)=>{
          return(
            <div key={participante.hash}>
              <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{display: "flex"}}>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: orange[500]}}>
                      {"#"+participante.id}
                    </Avatar>
                  </ListItemAvatar>
                  <Stack>
                    <ListItemText
                      primary={participante.name} 
                      secondary={participante.muestras?.map((muestra)=>
                        <Chip
                          key={muestra.hash}
                          component="span"
                          sx={{pl: "5px", mr: 1, backgroundColor: green[500]}}
                          icon={<FontAwesomeIcon icon={faCannabis} />}
                          label={<><Chip size="small" label={"#"+muestra.id} sx={{mr: 1, backgroundColor: green[300]}}/>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</>} />
                      )}
                    />
                    {participante.mesa&&
                      <Typography>{participante.mesa?.name}</Typography>
                    }
                  </Stack>
                </Box>
                <Button variant="outlined" sx={{justifySelf: "end"}} onClick={()=>{history.push("/participante/edit/"+participante.id)}}><FontAwesomeIcon icon={faEdit}/></Button>
              </ListItem>
              <Divider />
            </div>
          )
        })}
      </List>
    </Page>
  );
}
