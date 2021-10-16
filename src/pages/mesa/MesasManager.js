
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { Button, Chip, Divider, Grid, IconButton, InputBase, List, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import { Search } from "@material-ui/icons";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faEdit, faExclamationCircle, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { orange, green, red } from '@mui/material/colors';
import { DropBox } from "../../components/DropBox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableBox } from "../../components/DraggableBox";
import Context from "../../context/Context";
import ConfirmModal from "../../components/ConfirmModal";
import ButtonModal from "../../components/ButtonModal";


export default function MesasManager() {
  const [mesas, setMesas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [muestras, setMuestras] = useState([]);
  const [searchFieldMuestra, setSearchFieldMuestra] = useState("");
  const [searchFieldParticipante, setSearchFieldParticipante] = useState("");
  const [mesaName, setMesaName] = useState("");

  const context = useContext(Context);

  const listAllParticipantes = () => {
    setParticipantes([]);
    axios.get("/api/participante/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setParticipantes(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener los participantes","error");
      console.log(error);
    })   
  };

  const listAllMuestras = () => {
    setMuestras([]);
    axios.get("/api/muestras/qrs")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMuestras(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener las muestras","error");
      console.log(error);
    })
  };

  const listAllMesas = () => {
    setMesas([]);
    clearSearchFields();
    axios.get("/api/mesas/all")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMesas(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener las mesas","error");
      console.log(error);
    })
  };

  const deleteParticipanteOfMesa = (idParticipante, idMesa) => {
    axios.post("/api/mesas/remove-participante",{
      idParticipante: idParticipante,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const deleteMuestraOfMesa = (idMuestra, idMesa) => {
    axios.post("/api/mesas/remove-muestra",{
      idMuestra: idMuestra,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const updateMesa = (idMesa) => {
    axios.put("/api/mesas/update",{
      id: idMesa,
      name: mesaName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const createMesa = (mesa) => {
    axios.post("/api/mesas/create",{
      name: mesaName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa creada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo crear la mesa","error");
      console.log(error);
    })
  };

  const deleteMesa = (idMesa) => {
    axios.delete("/api/mesas/delete",{
      data:{
        id: idMesa,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa eliminada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la mesa","error");
      console.log(error);
    })
  };

  const clearSearchFields = () => {
    setSearchFieldMuestra("");
    setSearchFieldParticipante("");
  }

  const isParticipanteExistInMesas = (idParticipante) => {
    return mesas.map((mesa)=>mesa.participantes.map((participante)=>participante.id)).flat().includes(idParticipante);
  }

  const isMuestraExistInMesas = (idMuestra) => {
    return mesas.map((mesa)=>mesa.muestras.map((muestra)=>muestra.id)).flat().includes(idMuestra);
  }

  const muestraCountInMesas = (idMuestra) => {
    return mesas.map((mesa)=>mesa.muestras.map((muestra)=>muestra.id)).flat().reduce(function(valorAnterior, valorActual){
      return valorAnterior + ((valorActual===idMuestra)?1:0);
    },0)
  }

  useEffect(() => {
    listAllMesas();
    listAllParticipantes();
    listAllMuestras();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {searchFieldParticipante && participantes?.filter(participante => (parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase())) && !isParticipanteExistInMesas(participante.id)).map((participante, index)=>{
              return(<DraggableBox key={"participante"+participante.id} onUpdate={()=>listAllMesas()} name={"participante-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
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
          <ButtonModal onClick={()=>setMesaName("")} faIcon={faPlus} textButton="Crear Mesa" operation={()=>{createMesa()}}>
            <Box>
              <Divider sx={{pb:2}}>Nueva mesa</Divider>
              <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={mesaName} onChange={(e)=>setMesaName(e?.target?.value)} />
            </Box>
          </ButtonModal>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {searchFieldMuestra && muestras?.filter(muestra => parseInt(muestra.id)===(!isNaN(searchFieldMuestra)?parseInt(searchFieldMuestra):0) || muestra.name?.toLowerCase().includes(searchFieldMuestra?.toLowerCase())).map((muestra, index)=>{
              return(<DraggableBox key={"muestras"+muestras.id} onUpdate={()=>listAllMesas()} name={"muestra-"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, ml: 1, mr: 1}}>
                  <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                    <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                    <Chip size="small" label={"#"+muestra.id} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                    <Typography>{muestra.name}</Typography>
                    {isMuestraExistInMesas(muestra.id)&&
                      <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                    }
                  </Box>
                </DraggableBox>)
            })}
          </List>
          <Grid container>
            {mesas.map((mesa)=>{
              return(<Grid key={"mesa"+mesa.id} item xs={12} sm={6} sx={{padding: 1}}>
                <DropBox name={"mesa-"+mesa.id} displayName={mesa.name} sx={{minHeight: "250pt", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Box sx={{pr: 4, pl: 4}}>
                      {mesa.participantes.map((participante)=>
                        <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+participante.id} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                            <Typography>{participante.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteParticipanteOfMesa(participante.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.muestras.map((muestra)=>
                        <Box key={"mesa"+mesa.id+"muestra"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, ml: 5, mr: 5}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                            <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+muestra.id} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                            <Typography>{muestra.name}</Typography>
                            {muestraCountInMesas(muestra.id)>1&&
                              <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                            }
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteMuestraOfMesa(muestra.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", p: 1}}>
                      <ButtonModal onClick={()=>setMesaName(mesa.name)} faIcon={faEdit} operation={()=>{updateMesa(mesa.id)}}>
                        <Box>
                          <Divider sx={{pb:2}}>Editar mesa</Divider>
                          <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={mesaName} onChange={(e)=>setMesaName(e?.target?.value)} />
                        </Box>
                      </ButtonModal>
                      <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar la mesa?" operation={()=>{deleteMesa(mesa.id)}}/>
                    </Box>
                </DropBox>
              </Grid>)
            })}
          </Grid>
        </Stack>
      </DndProvider>
    </Page>
  );
}
