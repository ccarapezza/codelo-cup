
import { Avatar, Button, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis, faChair, faEdit, faStoreAlt, faVihara } from '@fortawesome/free-solid-svg-icons'
import { orange, green, deepPurple, lightGreen } from '@mui/material/colors';
import { useHistory } from "react-router";
import { Box } from "@mui/system";
import CategoriaColors from "../../CategoriaColors";

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
      {participantes?.length!==0?
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {participantes?.map((participante)=>{
            return(
              <div key={participante.hash}>
                <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
                  <Box sx={{display: "flex"}}>
                    <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                      <Avatar sx={{backgroundColor: orange[500]}}>
                        {"#"+participante.id}
                      </Avatar>
                    </ListItemAvatar>
                    <Stack>
                      <ListItemText
                        primary={
                          <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                            <Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{participante.name}</Typography>
                            {participante.dojo&&
                              <Chip icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} size="small" label={participante.dojo?.name} sx={{mr: 1, backgroundColor: deepPurple[400], color: "white"}}/>
                            }
                            {participante.grow&&
                              <Chip title="Es Grow" icon={
                                <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                                  <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                                  <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                                </span>
                              }
                              sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                              label={participante.grow}
                              />
                            }
                          </Box>
                        } 
                        secondary={participante.muestras?.map((muestra)=>
                          <Chip
                            key={muestra.hash}
                            component="span"
                            sx={{pl: "5px", mr: 1, backgroundColor: green[200], fontWeight: "bold"}}
                            icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                            label={
                            <>
                              <Chip size="small" label={"#"+muestra.id} sx={{mr: 1, backgroundColor: green[400]}}/>
                              {muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}
                              <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                            </>
                          } />
                        )}
                      />
                      {participante.mesa&&
                        <Chip icon={<FontAwesomeIcon icon={faChair} style={{color: "black", marginLeft:"10px"}}/>} variant="outlined" label={participante.mesa?.name} sx={{mr: 1, width: "fit-content", fontWeight: "bold"}}/>
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
        :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No se encontraron participantes"/></h2>
        </Box>
      }
    </Page>
  );
}
