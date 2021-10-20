
import { Avatar, Button, Chip, Divider, InputLabel, List, ListItem, ListItemAvatar, Paper, Rating, Stack, Typography} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { faCannabis, faClock, faEye, faEyeSlash, faSortAmountDown, faSortAmountUp, faStoreAlt, faUserAlt, faVihara } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deepOrange, green } from '@mui/material/colors';
import SelectCategoria from "../../components/SelectCategoria";
import CategoriaColors from "../../CategoriaColors";
import { deepPurple, lightGreen } from "@material-ui/core/colors";

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [muestraCategoriaFilter, setMuestraCategoriaFilter] = useState("")

  useEffect(() => {
    axios.get("/api/calificaciones/resultados")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        const calificaciones = response.data?.calificaciones;
        setResultados(calificaciones.reduce(function(m, d){
          if(!m[d.muestraId]){
            m[d.muestraId] = {...d, count: 1, calificaciones: []};
            delete d.muestra;
            m[d.muestraId].calificaciones.push(d);
            return m;
          }
          m[d.muestraId].presentacion += d.presentacion;
          m[d.muestraId].aromaPrendido += d.aromaPrendido;
          m[d.muestraId].aromaApagado += d.aromaApagado;
          m[d.muestraId].saborPrendido += d.saborPrendido;
          m[d.muestraId].saborApagado += d.saborApagado;
          m[d.muestraId].count += 1;
          delete d.muestra;
          m[d.muestraId].calificaciones.push(d);
          return m;
       },{}));
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
  //Custom Table End

  const [showDetails, setShowDetails] = useState(false);
  const [orderValue, setOrderValue] = useState("presentacion");
  const [sortOrder, setSortOrder] = useState(0);

  return (
    <Page title="Resultados" footer={false}>
        <Divider>Ordenar por:</Divider>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap: "wrap", margin: 2}} direction="row" spacing={1}>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="presentacion"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("presentacion"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="presentacion"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Presentación
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="aromaApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaApagado"); setSortOrder(sortOrder?0:1)}}>
          {orderValue==="aromaApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Aroma Apagado
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="aromaPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="aromaPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Aroma Prendido
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="saborPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Sabor Prendido
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="saborApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborApagado"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Sabor Apagado
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="promedioTotal"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("promedioTotal"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="promedioTotal"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Promedio Total
          </Button>
        </Stack>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", margin: 2}} direction="row" spacing={1}>
          {showDetails?
            <Button variant="outlined" onClick={()=>{setShowDetails(false)}}>
              <FontAwesomeIcon icon={faEyeSlash} style={{marginRight: 15}} />
              <Typography variant="h10">Ocultar calificaciones</Typography>
            </Button>
          :
            <Button variant="outlined" onClick={()=>{setShowDetails(true)}}>
              <FontAwesomeIcon icon={faEye} style={{marginRight: 15}} />
              <Typography variant="h10">Ver calificaciones</Typography>
            </Button>
          }
        </Stack>
        <Divider>Filtrar por:</Divider>
          <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", margin: 2}} direction="row" spacing={1}>
            <SelectCategoria blankLabel="Todas" value={muestraCategoriaFilter} onChange={(e)=>setMuestraCategoriaFilter(e?.target?.value)}/>
          </Stack>
        <Divider/>
        <List sx={{paddingTop: 0, marginTop: 0}}>
          {Object.keys(resultados).map((k)=>resultados[k])
            .map((e)=>{return({
              ...e,
              promedioTotal: ((e.presentacion+e.aromaApagado+e.aromaPrendido+e.saborPrendido+e.saborApagado)/5)
            })}).map((calificacion)=>{
              return({
                ...calificacion,
                presentacion: Math.round(calificacion.presentacion/calificacion.count * 10) / 10,
                aromaPrendido: Math.round(calificacion.aromaPrendido/calificacion.count * 10) / 10,
                aromaApagado: Math.round(calificacion.aromaApagado/calificacion.count * 10) / 10,
                saborPrendido: Math.round(calificacion.saborPrendido/calificacion.count * 10) / 10,
                saborApagado: Math.round(calificacion.saborApagado/calificacion.count * 10) / 10,
                promedioTotal: Math.round(calificacion.promedioTotal/calificacion.count * 10) / 10
              })
            })
            .sort(function(a, b) {
              if (a[orderValue] > b[orderValue]) {
                return sortOrder?1:-1;
              }
              if (a[orderValue] < b[orderValue]) {
                return sortOrder?-1:1;
              }
              return 0;
            })
            .filter((resultado)=>{
              if(resultado.muestra?.categoria && muestraCategoriaFilter){
                return parseInt(resultado.muestra.categoria.id) === muestraCategoriaFilter
              }else{
                return resultado;
              }
            })
            .map((resultado)=>{
              return(
                <div key={resultado.muestraId}>
                  <ListItem sx={{display:"flex", alignItems:"center", justifyContent: showDetails?"start":"center", overflowX: "auto"}}>
                    <ListItemAvatar sx={{display:"flex", flexDirection:"column", alignItems:"center", margin: 2}}>
                      <Avatar sx={{ width: 74, height: 74, bgcolor: green[500] }}>
                        <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <FontAwesomeIcon icon={faCannabis}/>
                          <h2 style={{padding:0, margin: 0}}>{"#"+resultado.muestraId}</h2>
                        </Stack>
                      </Avatar>
                      <h3 style={{padding:0, margin: 0}}>{resultado?.muestra?.name}</h3>
                      <Chip size="small" label={resultado?.muestra.categoria?.name} sx={{backgroundColor: CategoriaColors[resultado?.muestra.categoria.id], fontWeight: "bold"}}/>
                      <Paper variant="outlined" sx={{display:"flex", flexDirection:"column", alignItems:"center", padding: 1, marginTop: 2, bgcolor: deepOrange[500]}}>
                        <h6 style={{padding:0, margin:0}}><FontAwesomeIcon icon={faUserAlt} style={{marginRight: 5}}/>Participante</h6>
                        <Typography variant="h6" component="div">{"#"+resultado?.muestra?.participante?.id+" - "+resultado?.muestra?.participante?.name}</Typography>
                        {resultado?.muestra?.participante?.dojo&&
                          <Chip icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} size="small" label={resultado?.muestra?.participante?.dojo?.name} sx={{backgroundColor: deepPurple[400], color: "white"}}/>
                        }
                        {resultado?.muestra?.participante?.grow&&
                          <Chip title="Es Grow" icon={
                            <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                              <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                              <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                            </span>
                          }
                          sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                          label={resultado?.muestra?.participante?.grow}
                          />
                        }
                      </Paper>
                    </ListItemAvatar>
                    
                    <Paper sx={{padding:"5px", marginRight: "20px"}} elevation={4}>
                      <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                      <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{resultado.presentacion}</strong></InputLabel>
                      <Rating name="presentacion-input" value={resultado.presentacion} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                      <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{resultado.aromaApagado}</strong></InputLabel>
                      <Rating name="aromaApagado-input" value={resultado.aromaApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{resultado.aromaPrendido}</strong></InputLabel>
                      <Rating name="aromaPrendido-input" value={resultado.aromaPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                      <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{resultado.saborPrendido}</strong></InputLabel>
                      <Rating name="saborPrendido-input" value={resultado.saborPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{resultado.saborApagado}</strong></InputLabel>
                      <Rating name="saborApagado-input" value={resultado.saborApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                      <InputLabel htmlFor="saborApagado-input"><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                      <Rating name="saborApagado-input" value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider sx={{marginBottom: "5px"}}/>
                      <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                    </Paper>
                    {showDetails&&resultado.calificaciones?.map((calificacion)=>{
                      const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                      return(<Paper sx={{padding:"5px", mr: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                          <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.id} - ${calificacion.participante?.name}`}/></Divider>
                          <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{calificacion.presentacion}</strong></InputLabel>
                          <Rating name="presentacion-input" value={calificacion.presentacion} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider/>
                          <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaApagado}</strong></InputLabel>
                          <Rating name="aromaApagado-input" value={calificacion.aromaApagado} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaPrendido}</strong></InputLabel>
                          <Rating name="aromaPrendido-input" value={calificacion.aromaPrendido} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider/>
                          <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{calificacion.saborPrendido}</strong></InputLabel>
                          <Rating name="saborPrendido-input" value={calificacion.saborPrendido} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{calificacion.saborApagado}</strong></InputLabel>
                          <Rating name="saborApagado-input" value={calificacion.saborApagado} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider sx={{marginBottom: "5px"}}/>
                          <Box sx={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                            <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                          </Box>
                        </Paper>)
                    })}
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
        </List>
    </Page>
  );
}
