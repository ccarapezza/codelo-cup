
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { Button, Chip, Divider, Grid, IconButton, InputBase, List, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Search } from "@material-ui/icons";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faEdit, faExclamationCircle, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { orange, green, red, indigo } from '@mui/material/colors';
import { DropBox } from "../../components/DropBox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableBox } from "../../components/DraggableBox";
import Context from "../../context/Context";
import ConfirmModal from "../../components/ConfirmModal";
import ButtonModal from "../../components/ButtonModal";
import CategoriaColors from "../../CategoriaColors";
import { useTheme } from "@emotion/react";

export default function MesasManager() {
  const [loading, setLoading] = useState(false);
  const [mesas, setMesas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [muestras, setMuestras] = useState([]);
  const [searchFieldMuestra, setSearchFieldMuestra] = useState("");
  const [searchFieldParticipante, setSearchFieldParticipante] = useState("");
  const [mesaName, setMesaName] = useState("");

  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));


  const [mode, setMode] = useState("");

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
    setLoading(true);
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
    .then(function () {
      setLoading(false);
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

  const deleteParticipanteSecOfMesa = (idParticipante, idMesa) => {
    axios.post("/api/mesas/remove-participante-secundario",{
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
    setMode("");
    setSearchFieldMuestra("");
    setSearchFieldParticipante("");
  }

  const isParticipanteExistInMesas = (idParticipante) => {
    return mesas.map((mesa)=>mesa.participantes.map((participante)=>participante.id)).flat().includes(idParticipante);
  }

  const isParticipanteSecExistInMesas = (idParticipante) => {
    return mesas.map((mesa)=>mesa.participantesSecundarios.map((participante)=>participante.id)).flat().includes(idParticipante);
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
    <Page title="Mesas" footer={false} loading={loading} containerMaxWidth="xl">
      <DndProvider backend={HTML5Backend}>
        <Stack sx={{textAlign: "center"}} spacing={2}>
          <Box>
            <Button variant="outlined" onClick={()=>{mode==="participante"?setMode(""):setMode("participante")}} sx={{mx: 1, backgroundColor: orange[500], p:mode==="participante"?2:1}}>
              <FontAwesomeIcon icon={faUser}/><span style={{ marginLeft: 5 }}>Agregar Participantes</span>
            </Button>
            <Button variant="outlined" onClick={()=>{mode==="participanteSecundario"?setMode(""):setMode("participanteSecundario")}} sx={{mx: 1, backgroundColor: indigo[300], p:mode==="participanteSecundario"?2:1}}>
              <FontAwesomeIcon icon={faUser}/><span style={{ marginLeft: 5 }}>Agregar Participantes Sec.</span>
            </Button>
            <Button variant="outlined" onClick={()=>{mode==="muestra"?setMode(""):setMode("muestra")}} sx={{mx: 1, backgroundColor: green[500], p:mode==="muestra"?2:1}}>
              <FontAwesomeIcon icon={faCannabis}/><span style={{ marginLeft: 5 }}>Agregar Muestras</span>
            </Button>
            <ButtonModal onClick={()=>setMesaName("")} sx={{mx: 1}} faIcon={faPlus} textButton="Crear Mesa" operation={()=>{createMesa()}}>
              <Box>
                <Divider sx={{pb:2}}>Nueva mesa</Divider>
                <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={mesaName} onChange={(e)=>setMesaName(e?.target?.value)} />
              </Box>
            </ButtonModal>
          </Box>
          {mode==="participante"&&
            <>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={"Buscar Participante - ("+participantes?.filter(participante => !isParticipanteExistInMesas(participante.id)).length+" Restantes)"}
                  inputProps={{ 'aria-label': 'Buscar Participante'}}
                  value={searchFieldParticipante}
                  onChange={(e)=>setSearchFieldParticipante(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <List sx={{paddingTop: "0", marginTop: 0,display:"flex", flexWrap:"wrap"}}>
                {participantes?.filter(participante => (parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()) || participante.muestras.find(e=>e.categoria?.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()))) && !isParticipanteExistInMesas(participante.id)).map((participante, index)=>{
                  return(<DraggableBox key={"participante"+participante.id} data={{muestras: participante.muestras}} onUpdate={()=>listAllMesas()} name={"participante-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: orange[500], borderRadius: 1, margin: 1, width:"45%", overflow: "hidden"}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", width: "45%"}}>
                        <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+participante.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                        <Typography>{participante.name}</Typography>
                        {participante.muestras?.map((muestra)=>
                          <Chip
                            key={muestra.hash}
                            component="span"
                            sx={{pl: "5px", mr: 1, mb: 1, backgroundColor: green[200], fontWeight: "bold", height: "auto", p: "3px", mt: 1, mx: 1}}
                            icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                            label={
                            <Box sx={{display: "flex", flexDirection: matches?"row":"column", alignItems: "center", m:0, p:0, fontSize:".5rem!important"}}>
                              <Chip size="small" label={"#"+muestra.n} sx={{mx: 0, backgroundColor: green[400]}}/>
                              <Typography title={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} sx={{fontSize:".8rem!important", fontWeight: "bold", maxWidth:"50px", overflow: "hidden", textOverflow: "ellipsis", px: "5px"}}>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</Typography>
                              <Chip size="small" label={muestra.categoria?.name} sx={{mx: 0, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                            </Box>
                          } />
                        )}
                      </Box>
                    </DraggableBox>)
                })}
              </List>
            </>
          }
          {mode==="participanteSecundario"&&
            <>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={"Buscar Participante Sec. - ("+participantes?.filter(participante => !isParticipanteSecExistInMesas(participante.id)).length+" Restantes)"}
                  inputProps={{ 'aria-label': 'Buscar Participante Sec.'}}
                  value={searchFieldParticipante}
                  onChange={(e)=>setSearchFieldParticipante(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <List sx={{paddingTop: "0", marginTop: 0,display:"flex", flexWrap:"wrap"}}>
                {participantes?.filter(participante => (parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()) || participante.muestras.find(e=>e.categoria?.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()))) && !isParticipanteSecExistInMesas(participante.id)).map((participante, index)=>{
                  return(<DraggableBox key={"participante"+participante.id} data={{muestras: participante.muestras}} onUpdate={()=>listAllMesas()} name={"participanteSecundario-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: indigo[300], borderRadius: 1, margin: 1, width:"45%", overflow: "hidden"}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", width: "45%"}}>
                        <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+participante.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: indigo[200]}}/>
                        <Typography>{participante.name}</Typography>
                        {participante.muestras?.map((muestra)=>
                          <Chip
                            key={muestra.hash}
                            component="span"
                            sx={{pl: "5px", mr: 1, mb: 1, backgroundColor: green[200], fontWeight: "bold", height: "auto", p: "3px", mt: 1, mx: 1}}
                            icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                            label={
                            <Box sx={{display: "flex", flexDirection: matches?"row":"column", alignItems: "center", m:0, p:0, fontSize:".5rem!important"}}>
                              <Chip size="small" label={"#"+muestra.n} sx={{mx: 0, backgroundColor: green[400]}}/>
                              <Typography title={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} sx={{fontSize:".8rem!important", fontWeight: "bold", maxWidth:"50px", overflow: "hidden", textOverflow: "ellipsis", px: "5px"}}>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</Typography>
                              <Chip size="small" label={muestra.categoria?.name} sx={{mx: 0, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                            </Box>
                          } />
                        )}
                      </Box>
                    </DraggableBox>)
                })}
              </List>
            </>
          }
          {mode==="muestra"&&
            <>
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
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <List sx={{paddingTop: "0", marginTop: 0}}>
                {muestras?.filter(muestra => parseInt(muestra.id)===(!isNaN(searchFieldMuestra)?parseInt(searchFieldMuestra):0) || muestra.name?.toLowerCase().includes(searchFieldMuestra?.toLowerCase())).map((muestra, index)=>{
                  return(<DraggableBox key={"muestras"+muestra.id} onUpdate={()=>listAllMesas()} name={"muestra-"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, ml: 1, mr: 1}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                        <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+muestra.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                        <Typography>{muestra.name}</Typography>
                        <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, backgroundColor: CategoriaColors[muestra.categoria?.id], fontWeight: "bold"}}/>
                        {isMuestraExistInMesas(muestra.id)&&
                          <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                        }
                        <Box title={muestra?.participante?.name} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[200], borderRadius: 1, p: 0, ml: 1, fontSize: "100%"}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", p: "2px"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 5}}/>
                            <Typography sx={{mx: 1, fontSize: "90%", fontWeight: "bold"}}>{"#"+muestra?.participante?.n}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </DraggableBox>)
                })}
              </List>
            </>
          }
          <Grid container>
            {mesas.sort(function(a, b) {
              const nameA = a.name.toUpperCase();
              const nameB = b.name.toUpperCase();
              return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            }).map((mesa)=>{
              return(<Grid key={"mesa"+mesa.id} item xs={12} sm={3} sx={{padding: 1}}>
                <DropBox name={"mesa-"+mesa.id} displayName={mesa.name} data={{participantes: mesa.participantes, participantesSecundarios: mesa.participantesSecundarios, muestras: mesa.muestras}} sx={{minHeight: "250pt", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Box sx={{pr: 4, pl: 4}}>
                      {mesa.participantes.map((participante)=>
                        <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+participante.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{participante.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteParticipanteOfMesa(participante.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.participantesSecundarios.map((participante)=>
                        <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: indigo[300], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+participante.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: indigo[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{participante.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteParticipanteSecOfMesa(participante.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.muestras.map((muestra)=>
                        <Box key={"mesa"+mesa.id+"muestra"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+muestra.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{muestra.name}</Typography>
                            <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, p:"0px", backgroundColor: CategoriaColors[muestra.categoria?.id], fontWeight: "bold"}}/>
                            {muestraCountInMesas(muestra.id)>1&&
                              <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                            }
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteMuestraOfMesa(muestra.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
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
