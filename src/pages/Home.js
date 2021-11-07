import React, { useContext, useEffect, useState } from "react";
import { faCannabis, faChair, faClock, faDatabase, faGavel, faListAlt, faPollH, faQrcode, faSearch, faServer, faSignOutAlt, faSquare, faTags, faUser, faUserPlus, faVihara } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Divider, Grid, InputLabel, Paper, Rating, Stack } from "@mui/material";
import { useHistory } from "react-router";
import Context from "../context/Context";
import Page from "./Page";
import axios from "axios";
import { Box } from "@mui/system";
import copaLogo from './../assets/copa-logo.png'

export default function Home() {
  const context = useContext(Context);
  let history = useHistory();
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const listCalificaciones = () => {
    setLoading(true);
    setCalificaciones();
    axios.get("/api/participante/calificaciones")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCalificaciones(response.data?.calificaciones);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    }).then(function() {
      setLoading(false);
    })
  };

  useEffect(() => {
    if(context.isParticipanteLogged){
      listCalificaciones();
    }
  }, [context.isParticipanteLogged]);

  return (
    <Page title="Home" loading={loading}>
      <Stack spacing={2}>
        {context.isLogged?
          <>
            <Divider>
              <Chip label="Menú Administrador" color="primary"/>
            </Divider>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/create")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faUserPlus} transform="shrink-6 left-1"/>
              </span>
              <span>Nuevo Participante</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Listado Participantes</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/create-jurado")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faGavel} transform="shrink-6 left-1"/>
              </span>
              <span>Nuevo Jurado</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/jurado-list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Listado Jurados</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/dojo/list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faVihara} transform="shrink-6 left-1"/>
              </span>
              <span>Listado Dojos</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/categoria/list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faTags} transform="shrink-6 left-1"/>
              </span>
              <span>Listado Categorias</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/participante/qr-list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                <FontAwesomeIcon icon={faUser} inverse transform="shrink-12 down-4 right-4"/>
              </span>
              <span>QRs Participantes</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/muestra/qr-list")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                <FontAwesomeIcon icon={faCannabis} inverse transform="shrink-12 down-4 right-4"/>
              </span>
              <span>QRs Muestras</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/calificaciones/resultados")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faPollH} transform="shrink-6 left-1"/>
              </span>
              <span>Resultados</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/calificaciones/muestra")}}>
                <span className="fa-layers fa-fw fa-6x">
                  <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                  <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                  <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                </span>
              <span>Consultar Muestras</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/mesas-manager")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faChair} transform="shrink-6 left-1"/>
              </span>
              <span>Mesas</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/summary")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faDatabase} transform="shrink-6 left-1"/>
              </span>
              <span>Summary</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/summary-calificaciones")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faServer} transform="shrink-6 left-1"/>
              </span>
              <span>Summary Calificaciones</span>
            </Button>
            <Button variant="outlined" fullWidth onClick={(e)=>{context.logout()}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Cerrar Sesión</span>
            </Button>
          </>
          :context.isParticipanteLogged?
            <>
              <Button variant="outlined" sx={{alignItems: "center", flexDirection: "column"}} onClick={(e)=>{history.push("/calificacion")}} >
                <span className="fa-layers fa-fw fa-6x">
                  <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                  <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                  <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
                </span>
                <span>Calificar Muestra</span>
              </Button>
              {context.isJuradoLogged&&
                <Button variant="outlined" sx={{alignItems: "center", flexDirection: "column"}} onClick={(e)=>{history.push("/calificaciones/muestra")}}>
                  <span className="fa-layers fa-fw fa-6x">
                    <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                  <span>Consultar Muestras</span>
                </Button>
              }
              <Divider>Calificaciones realizadas</Divider>
              {calificaciones?.length?
                <Grid container>
                  {calificaciones?.map((calificacion)=>{
                    const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                    return(<Grid item xs={12} key={calificacion?.muestra?.hash} paddingBottom="10px">
                      <Paper sx={{padding:"5px"}} elevation={3}>
                        <Divider sx={{pb:"5px"}}><Chip color="secondary" label={`Muestra #${calificacion.muestra.n}`}/></Divider>
                        <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{calificacion.presentacion}</strong></InputLabel>
                        <Rating name="presentacion-input" value={calificacion.presentacion} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider/>
                        <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaApagado}</strong></InputLabel>
                        <Rating name="aromaApagado-input" value={calificacion.aromaApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaPrendido}</strong></InputLabel>
                        <Rating name="aromaPrendido-input" value={calificacion.aromaPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider/>
                        <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{calificacion.saborPrendido}</strong></InputLabel>
                        <Rating name="saborPrendido-input" value={calificacion.saborPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{calificacion.saborApagado}</strong></InputLabel>
                        <Rating name="saborApagado-input" value={calificacion.saborApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider sx={{marginBottom: "5px"}}/>
                        <Box sx={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                          {/*<Button startIcon={<Edit/>} color="secondary" variant="contained" size="small" onClick={()=>history.push("/calificacion/"+calificacion?.muestra?.hash)}>Editar</Button>*/}
                          <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                        </Box>
                      </Paper>
                    </Grid>)
                  })}
                </Grid>
                :
                <Chip label="Aún no ha realizado calificaciones"/>
              }
            </>
          :
          <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
              <img src={copaLogo} alt="CodeloCup" style={{width:"100%", maxWidth:"500px"}}/>
            </Box>
            <Button variant="outlined" fullWidth onClick={(e)=>{history.push("/login")}}>
              <span className="fa-layers fa-fw fa-6x">
                <FontAwesomeIcon icon={faUser} transform="shrink-6 left-1"/>
                <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
              </span>
              <span>Ingresar</span>
            </Button>
          </>
        }
      </Stack>
    </Page>
  );
}
