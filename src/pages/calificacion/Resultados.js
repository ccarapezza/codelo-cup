
import { Avatar, Button, Chip, Divider, FormControlLabel, InputLabel, List, ListItem, ListItemAvatar, Paper, Rating, Stack, Switch, Typography, useMediaQuery} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Page from "../Page";
import { faCannabis, faClock, faEye, faEyeSlash, faGavel, faSortAmountDown, faSortAmountUp, faStoreAlt, faSync, faUser, faUserAlt, faVihara } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deepOrange, green } from '@mui/material/colors';
import SelectCategoria from "../../components/SelectCategoria";
import CategoriaColors from "../../CategoriaColors";
import { deepPurple, lightGreen } from "@material-ui/core/colors";
import { useTheme } from "@emotion/react";

export default function Resultados() {
  const [loading, setLoading] = useState(false); 
  const [resultados, setResultados] = useState([]);
  const [resultadoProcessed, setResultadoProcessed] = useState([]); 
  const [muestraCategoriaFilter, setMuestraCategoriaFilter] = useState("")
  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));
  //Custom Table End

  const [showDetails, setShowDetails] = useState(false);
  const [orderValue, setOrderValue] = useState("presentacion");
  const [sortOrder, setSortOrder] = useState(0);
  const [dojoFilter, setDojoFilter] = useState(false);
  const [growFilter, setGrowFilter] = useState(false);
  const [juradoFilter, setJuradoFilter] = useState(false);
  const [participanteFilter, setParticipanteFilter] = useState(false);  

  const loadResultados = useCallback(
    () => {
      setLoading(true);
      axios.get("/api/calificaciones/resultados")
      .then(function (response) {
        // handle success
        if(response.status === 200){
          const calificaciones = response.data?.calificaciones;
          setResultados(calificaciones
            .filter((calificacion)=>{
              if(juradoFilter){
                return calificacion.participante.esJurado;
              }else if(participanteFilter){
                return !calificacion.participante.esJurado;
              }else{
                return true;
              }
            })
            .reduce(function(m, d){
              if(!m[d.muestraId]){
                m[d.muestraId] = {
                  ...d,
                  count: 1,
                  calificaciones: []
                };
                delete d.muestra;
                m[d.muestraId].calificaciones.push(d);
                return m;
              }

              m[d.muestraId].valores.map((currentValor, index)=>{
                currentValor.valor += d.valores[index].valor
              })
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
      .then(function(){
        setLoading(false);
      })
    },
    [juradoFilter, participanteFilter],
  )

  useEffect(() => {
    const resultadoSortAndFilter = Object.keys(resultados).map((k)=>resultados[k])
      .map((e)=>{
        return({
        ...e,
        promedioTotal: (e.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor) / e.valores.length)
      })})
      .map((calificacion)=>{
        return({
          ...calificacion,
          valores: calificacion.valores.map((currentValor)=>{
            return({
              ...currentValor,
              valor: Math.round(currentValor.valor/calificacion.count * 10) / 10
            })
          }),
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
        if(dojoFilter){
          return resultado.muestra?.participante?.dojo?true:false;
        }
        if(growFilter){
          return resultado.muestra?.participante?.grow?true:false;
        }
        return resultado;
      })
      .filter((resultado)=>{
        if(resultado.muestra?.categoria && muestraCategoriaFilter){
          return parseInt(resultado.muestra.categoria.id) === muestraCategoriaFilter
        }else{
          return resultado;
        }
      });
      setResultadoProcessed(resultadoSortAndFilter);
  }, [dojoFilter, growFilter, muestraCategoriaFilter, orderValue, resultados, sortOrder])

  useEffect(() => {
    loadResultados();
  }, [loadResultados]);

  return (
    <Page title="Resultados" footer={false} loading={loading}>
        <Divider sx={{m: 0}}>Ordenar por:</Divider>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap: "wrap", margin: 0}} direction="row" spacing={1}>
          {/*
          Agregar filtros segun categoria
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="presentacion"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("presentacion"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="presentacion"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Presentación</small>
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="aromaApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaApagado"); setSortOrder(sortOrder?0:1)}}>
          {orderValue==="aromaApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Aroma (En flor)</small>
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="aromaPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="aromaPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Aroma (Picadura)</small>
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="saborPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Sabor Prendido</small>
          </Button>
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="saborApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborApagado"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Sabor Apagado</small>
          </Button>
          */}
          
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="promedioTotal"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("promedioTotal"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="promedioTotal"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Promedio Total</small>
          </Button>
        </Stack>
        <Divider>Filtrar por:</Divider>
          <Box sx={{display:"flex", flexDirection:matches?"row":"column"}}>
            <SelectCategoria sx={{flexGrow: 1, whiteSpace:"nowrap", width: "auto", mt:0, mb:1}} blankLabel="Todas" value={muestraCategoriaFilter} onChange={(e)=>setMuestraCategoriaFilter(e?.target?.value)}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={dojoFilter} onChange={(e)=>{setDojoFilter(e.target.checked); setGrowFilter(e.target.checked?false:growFilter);}} />} label={<><FontAwesomeIcon icon={faVihara}/>Categoria Dojos</>}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={growFilter} onChange={(e)=>{setGrowFilter(e.target.checked); setDojoFilter(e.target.checked?false:dojoFilter);}} />} label={<><span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}><FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/><FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/></span>Categoria Grows</>}/>           
          </Box>
        <Divider/>
          <Box sx={{display:"flex", flexDirection:matches?"row":"column"}}>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={juradoFilter} onChange={(e)=>{setJuradoFilter(e.target.checked); setParticipanteFilter(e.target.checked?false:participanteFilter);}} />} label={<><FontAwesomeIcon icon={faGavel}/>Solo Jurados</>}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={participanteFilter} onChange={(e)=>{setParticipanteFilter(e.target.checked); setJuradoFilter(e.target.checked?false:juradoFilter);}} />} label={<><FontAwesomeIcon icon={faUser}/>Solo Participantes</>}/>
          </Box>
        <Divider/>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", margin: 1}} direction="row" spacing={1}>
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
          <Button variant="outlined" onClick={()=>{loadResultados()}}>
            <FontAwesomeIcon icon={faSync} style={{marginRight: 15}} />
            <Typography variant="h10">Refrescar</Typography>
          </Button>
        </Stack>
        <Divider/>
        <List sx={{paddingTop: 0, marginTop: 0}}>
          {
            growFilter&&(resultadoProcessed.reduce(function(grows, muestraGrow){
              const findedGrow = grows.findIndex(g=>muestraGrow?.muestra?.participante?.grow===g?.muestra?.participante?.grow);
              if(findedGrow){
                let newGrow  = {
                  muestra: muestraGrow.muestra,
                  valores: muestraGrow.valores,
                  promedioTotal: muestraGrow.promedioTotal,
                  count: 1,
                  muestras: []
                };
                newGrow.muestras.push(muestraGrow);
                grows.push(newGrow);
              }else{
                grows[findedGrow].valores.map((currentValor, index)=>{
                  currentValor.valor += muestraGrow.valores[index].valor
                })
                grows[findedGrow].count += 1;
                grows[findedGrow].muestras.push(muestraGrow);
              }
              return grows;
            },[])
            .map((calificacion)=>{
              return({
                ...calificacion,
                valores: calificacion.valores.map((currentValor)=>{
                  return({
                    ...currentValor,
                    valor: Math.round(currentValor.valor/calificacion.count * 10) / 10
                  })
                }),
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
            .map((resultado)=>{
              return(<div key={"res-"+resultado.muestra?.participante?.grow}>
                <Paper sx={{padding:"5px", margin: 2}} elevation={4}>
                  <Divider sx={{pb:"5px"}}><Chip title="Es Grow" icon={
                                  <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                                    <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                                    <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                                  </span>
                                }
                                sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                                label={resultado.muestra?.participante?.grow}
                                /></Divider>
                  <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                    {resultado.valores.map((currentValor, index)=>{
                      const idInput = "valores-grows-"+index+"-input"
                      return(<>
                          <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                          <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                          <Divider/>
                        </>)
                    })}
                  <Divider sx={{marginBottom: "5px"}}/>
                  <InputLabel>Muestras: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                </Paper>
              </div>)
            }))
          }

          {
            dojoFilter&&(resultadoProcessed.reduce(function(dojos, muestraDojo){
              if(!dojos[muestraDojo?.muestra?.participante?.dojo?.id]){
                dojos[muestraDojo?.muestra?.participante?.dojo?.id] = {
                  muestra: muestraDojo.muestra,
                  valores: muestraDojo.valores,
                  promedioTotal: muestraDojo.promedioTotal,
                  count: 1,
                  muestras: []
                };
                dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
                return dojos;
              }

              dojos[muestraDojo?.muestra?.participante?.dojo?.id].valores.map((currentValor, index)=>{
                currentValor.valor += muestraDojo.valores[index].valor
              })
              dojos[muestraDojo?.muestra?.participante?.dojo?.id].count += 1;
              dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
              return dojos;
            },[])
            .map((calificacion)=>{
              return({
                ...calificacion,
                valores: calificacion.valores.map((currentValor)=>{
                  return({
                    ...currentValor,
                    valor: Math.round(currentValor.valor/calificacion.count * 10) / 10
                  })
                }),
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
            .map((resultado)=>{
              return(<div key={"res-"+resultado.muestra?.participante?.dojo?.id}>
                <Paper sx={{padding:"5px", margin: 2}} elevation={4}>
                  <Divider sx={{pb:"5px"}}><Chip component="div" icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} label={resultado?.muestra?.participante?.dojo?.name} sx={{backgroundColor: deepPurple[400], color: "white", fontWeight: "bold", fontSize:"1.2rem"}}/></Divider>
                  <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>

                  {resultado.valores.map((currentValor, index)=>{
                    const idInput = "valores-dojo-"+index+"-input"
                    return(<>
                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider/>
                      </>)
                  })}
                  <Divider sx={{marginBottom: "5px"}}/>
                  <InputLabel>Muestras: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                </Paper>
              </div>)
            }))
          }
          {!dojoFilter&&!growFilter&&resultadoProcessed?.map((resultado)=>{
              return(
                <div key={resultado.muestraId}>
                  <ListItem className="scroll-flex-fix" sx={{display:"flex", alignItems:"center", overflowX: "auto"}}>
                    
                  <ListItemAvatar sx={{display:"flex", flexDirection:"column", alignItems:"center", margin: 2}}>
                      <Avatar sx={{ width: 74, height: 74, bgcolor: green[500] }}>
                        <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <FontAwesomeIcon icon={faCannabis}/>
                          <h2 style={{padding:0, margin: 0}}>{"#"+resultado?.muestra?.n}</h2>
                        </Stack>
                      </Avatar>
                      <h3 style={{padding:0, margin: 0}}>{resultado?.muestra?.name}</h3>
                      <Chip size="small" label={resultado?.muestra.categoria?.name} sx={{backgroundColor: CategoriaColors[resultado?.muestra.categoria.id], fontWeight: "bold"}}/>
                      <Paper variant="outlined" sx={{display:"flex", flexDirection:"column", alignItems:"center", padding: 1, marginTop: 2, bgcolor: deepOrange[500]}}>
                        <h6 style={{padding:0, margin:0}}><FontAwesomeIcon icon={faUserAlt} style={{marginRight: 5}}/>Participante</h6>
                        <Typography variant="h6" component="div" className="max-150" sx={{whiteSpace: "nowrap"}}>{"#"+resultado?.muestra?.participante?.n+" - "+resultado?.muestra?.participante?.name}</Typography>
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
                    <Paper sx={{padding:"5px", marginRight: 2}} elevation={4}>
                      <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                      {resultado.valores.map((currentValor, index)=>{
                        const idInput = "valores-"+index+"-input"
                        return(<>
                            <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                            <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                            <Divider/>
                          </>)
                      })}
                      <Divider sx={{marginBottom: "5px"}}/>
                      <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                    </Paper>
                    {showDetails&&resultado.calificaciones?.map((calificacion)=>{
                      const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                      return(<Paper sx={{padding:"5px", mr: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                          <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                          {resultado.valores.map((currentValor, index)=>{
                            const idInput = "valores-details-"+index+"-input"
                            return(<>
                                <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                <Divider/>
                              </>)
                          })}
                          <Divider sx={{marginBottom: "5px"}}/>
                          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Chip variant="outlined" label={calificacion.participante.mesa?.name?calificacion.participante.mesa?.name:"SIN MESA"} />
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
