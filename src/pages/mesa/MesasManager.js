
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { Chip, Grid, IconButton, InputBase, List, Paper, Stack, Typography } from "@mui/material";
import { Search } from "@material-ui/icons";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { orange, green } from '@mui/material/colors';
import { DropBox } from "../../components/DropBox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableBox } from "../../components/DraggableBox";


export default function MesasManager() {
  const [mesas, setMesas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [muestras, setMuestras] = useState([]);
  const [searchFieldMuestra, setSearchFieldMuestra] = useState("");
  const [searchFieldParticipante, setSearchFieldParticipante] = useState("");

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

  const listAllMuestras = () => {
    setMuestras();
    axios.get("/api/muestras/qrs")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMuestras(response.data);
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

  const listAllMesas = () => {
    setMuestras();
    axios.get("/api/mesas/all")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMesas(response.data);
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
    listAllMesas();
    listAllParticipantes();
    listAllMuestras();
  }, []);

  return (
    <Page title="Mesas" footer={false}>
      <DndProvider backend={HTML5Backend}>
        <Stack sx={{textAlign: "center"}} spacing={2}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar Participante"
              inputProps={{ 'aria-label': 'Buscar Participante' }}
              value={searchFieldParticipante}
              onChange={(e)=>setSearchFieldParticipante(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {searchFieldParticipante && participantes?.filter(participante => parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase())).map((participante, index)=>{
              return(<DraggableBox onUpdate={()=>listAllMesas()} name={"participante-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
                  <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                    <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                    <Chip size="small" label={"#"+participante.id} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                    <Typography>{participante.name}</Typography>
                  </Box>
                </DraggableBox>)
            })}
          </List>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar Muestra"
              inputProps={{ 'aria-label': 'Buscar Muestra' }}
              value={searchFieldMuestra}
              onChange={(e)=>setSearchFieldMuestra(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {searchFieldMuestra && muestras?.filter(muestra => parseInt(muestra.id)===(!isNaN(searchFieldMuestra)?parseInt(searchFieldMuestra):0) || muestra.name?.toLowerCase().includes(searchFieldMuestra?.toLowerCase())).map((muestra, index)=>{
              return(<DraggableBox onUpdate={()=>listAllMesas()} name={"muestra-"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, ml: 1, mr: 1}}>
                  <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                    <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                    <Chip size="small" label={"#"+muestra.id} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                    <Typography>{muestra.name}</Typography>
                  </Box>
                </DraggableBox>)
            })}
          </List>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DropBox name="mesa-1">                 
                  <Box sx={{pr: 4, pl: 4}}>
                    <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                        <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                        <Chip size="small" label="#12" sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                        <Typography>Jorge</Typography>
                      </Box>
                      <IconButton sx={{justifySelf:"end"}}>
                        <FontAwesomeIcon icon={faTrash} style={{}}/>
                      </IconButton>
                    </Box>
                    <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, ml: 5, mr: 5}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                        <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                        <Chip size="small" label="#12" sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                        <Typography>Garompa Haze</Typography>
                      </Box>
                      <IconButton sx={{justifySelf:"end"}}>
                        <FontAwesomeIcon icon={faTrash} style={{}}/>
                      </IconButton>
                    </Box>
                  </Box>
              </DropBox>
            </Grid>
            <Grid item xs={6}>
              
            </Grid>
            <Grid item xs={6}>
              
            </Grid>
            <Grid item xs={6}>
              
            </Grid>
          </Grid>
        </Stack>
        MESAS: {JSON.stringify(mesas)}
      </DndProvider>
    </Page>
  );
}
