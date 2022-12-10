
import { Avatar, Button, Chip, Divider, FormControlLabel, InputLabel, List, ListItem, ListItemAvatar, Paper, Rating, Stack, Switch, Typography, useMediaQuery} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
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

  const [calificaciones, setCalificaciones] = useState([]);

  const [resultados, setResultados] = useState([]);
  const [resultadoProcessed, setResultadoProcessed] = useState([]);
  const [resultadoGrouped, setResultadoGrouped] = useState([]);
  const [muestraCategoriaFilter, setMuestraCategoriaFilter] = useState("")
  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));
  //Custom Table End

  const [showDetails, setShowDetails] = useState(false);
  const [orderValue, setOrderValue] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [dojoFilter, setDojoFilter] = useState(false);
  const [growFilter, setGrowFilter] = useState(false);
  const [juradoFilter, setJuradoFilter] = useState(false);
  const [participanteFilter, setParticipanteFilter] = useState(false);  

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    setLoading(true);
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
      .then(function(){
        setLoading(false);
      })
  }, []);

  const reloadResultados = ()=>{
    setLoading(true);
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
      .then(function(){
        setLoading(false);
      })
  }

  useEffect(() => {
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
            muestraId: d.muestraId,
            muestra: d.muestra,
            valores: d.valores,
            count: 1,
            calificaciones: []
          };
          m[d.muestraId].calificaciones.push(d);
          return m;
        }

        m[d.muestraId].valores = m[d.muestraId].valores.map((currentValor, index)=>{
          return {
            ...currentValor,
            valor: currentValor.valor + d.valores[index].valor
          };
        })
        m[d.muestraId].count += 1;
        m[d.muestraId].calificaciones.push(d);
        return m;
    },{}));
  }, [calificaciones, juradoFilter, participanteFilter])

  useEffect(() => {
    const resultadoSortAndFilter = Object.keys(resultados).map((k)=>resultados[k])
      .map((e)=>{
        return({
        ...e,
        promedioTotal: (e.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / e.valores.length)
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
      .filter((resultado)=>{
        if(resultado.muestra?.categoria && muestraCategoriaFilter){
          return parseInt(resultado.muestra.categoria.id) === muestraCategoriaFilter
        }else{
          return resultado;
        }
      })
      .sort(function(a, b) {
        let aValue = null;
        let bValue = null;

        if(orderValue==="promedioTotal"){
          aValue = a.promedioTotal;
          bValue = b.promedioTotal;
        }else if(orderValue){
          aValue = a.valores.find((valor)=>camelize(valor.label)===orderValue).valor;
          bValue = b.valores.find((valor)=>camelize(valor.label)===orderValue).valor;
        }
        if (aValue > bValue) {
          return sortOrder?1:-1;
        }
        if (aValue < bValue) {
          return sortOrder?-1:1;
        }
        return 0;
      });
      setResultadoProcessed(resultadoSortAndFilter);
  }, [dojoFilter, growFilter, muestraCategoriaFilter, orderValue, resultados, sortOrder])

  useEffect(() => {
    let resultadoGroupedList;
    if(resultadoProcessed.length>0){
      resultadoGroupedList = resultadoProcessed.filter((resultado)=>{
        if(dojoFilter){
          return resultado.muestra?.participante?.dojo?true:false;
        }
        if(growFilter){
          return resultado.muestra?.participante?.grow?true:false;
        }
        return resultado;
      });
      if(dojoFilter){
        resultadoGroupedList = resultadoGroupedList.reduce(function(dojos, muestraDojo){
          if(!dojos[muestraDojo?.muestra?.participante?.dojo?.id]){
            dojos[muestraDojo?.muestra?.participante?.dojo?.id] = {
              muestra: muestraDojo.muestra,
              valores: [],
              promedioTotal: muestraDojo.promedioTotal,
              count: 1,
              muestras: []
            };
            dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
            return dojos;
          }
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].promedioTotal += muestraDojo.promedioTotal;
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].count += 1;
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
          return dojos;
        },[])
      }
  
      if(growFilter){
        resultadoGroupedList = resultadoGroupedList.reduce(function(grows, muestraGrow){
          const findedGrow = grows.findIndex(g=>muestraGrow?.muestra?.participante?.grow===g?.muestra?.participante?.grow);
          if(findedGrow<0){
            let newGrow  = {
              muestra: muestraGrow.muestra,
              promedioTotal: muestraGrow.promedioTotal,
              count: 1,
              muestras: []
            };
            newGrow.muestras.push(muestraGrow);
            grows.push(newGrow);
          }else{
            grows[findedGrow].promedioTotal += muestraGrow.promedioTotal;
            grows[findedGrow].count += 1;
            grows[findedGrow].muestras.push(muestraGrow);
          }
          return grows;
        },[])
      }
  
      if(dojoFilter||growFilter){
        setResultadoGrouped(resultadoGroupedList.map((calificacion)=>{
          return({
            ...calificacion,
            valores: [],
            promedioTotal: Math.round(calificacion.promedioTotal/calificacion.count * 10) / 10
          })
        })
        .sort(function(a, b) {
          const aValue = a.promedioTotal;
          const bValue = b.promedioTotal;
          if (aValue > bValue) {
            return sortOrder?1:-1;
          }
          if (aValue < bValue) {
            return sortOrder?-1:1;
          }
          return 0;
        }));
      }
    }
  }, [dojoFilter, growFilter, resultadoProcessed]);

  /*
  useEffect(() => {
    loadResultados();
  }, [loadResultados]);
  */

  const camelize = (str)=> {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  return (
    <Page title="Resultados" footer={false} loading={loading}>
        <Divider sx={{m: 0}}>Ordenar por:</Divider>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap: "wrap", margin: 0}} direction="row" spacing={1}>
          {labels.map((label, index)=>{
            const lbl = camelize(label);
            return(<Button key={"label-order-"+index} color="secondary" sx={{margin: "5px!important"}} variant={orderValue===lbl?"contained":"outlined"} size="small" onClick={()=>{setOrderValue(lbl); setSortOrder(sortOrder?0:1)}}>
              {orderValue===label&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
              <small>{label}</small>
            </Button>);
          })}
          <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="promedioTotal"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("promedioTotal"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="promedioTotal"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            <small>Promedio Total</small>
          </Button>
        </Stack>
        <Divider>Filtrar por:</Divider>
          <Box sx={{display:"flex", flexDirection:matches?"row":"column"}}>
            <SelectCategoria sx={{flexGrow: 1, whiteSpace:"nowrap", width: "auto", mt:0, mb:1}} blankLabel="Todas" value={muestraCategoriaFilter} onChange={(e)=>{setMuestraCategoriaFilter(e?.target?.value); setOrderValue("");}} setLabels={setLabels}/>
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
          <Button variant="outlined" onClick={()=>{reloadResultados()}}>
            <FontAwesomeIcon icon={faSync} style={{marginRight: 15}} />
            <Typography variant="h10">Refrescar</Typography>
          </Button>
        </Stack>
        <Divider/>
        <List sx={{paddingTop: 0, marginTop: 0}}>
          {
            growFilter&&(resultadoGrouped.map((resultado)=>{
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
                      return(<React.Fragment key={"res-val-"+resultado.muestra?.participante?.grow+"-"+index}>
                          <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                          <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                          <Divider/>
                        </React.Fragment>)
                    })}
                  <InputLabel htmlFor={"promedio-total-grow-input-"+resultado.id}><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                    <Rating name={"promedio-total-grow-input-"+resultado.id} value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                  <Divider sx={{marginBottom: "5px"}}/>
                  <InputLabel>Muestras: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                </Paper>
              </div>)
            }))
          }
          {
            dojoFilter&&(resultadoGrouped.map((resultado)=>{
              console.log("res", resultado);
              return(<div key={"res-"+resultado.muestra?.participante?.dojo?.id}>
                <Paper sx={{padding:"5px", margin: 2}} elevation={4}>
                  <Divider sx={{pb:"5px"}}><Chip component="div" icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} label={resultado?.muestra?.participante?.dojo?.name} sx={{backgroundColor: deepPurple[400], color: "white", fontWeight: "bold", fontSize:"1.2rem"}}/></Divider>
                  <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>

                  {resultado.valores.map((currentValor, index)=>{
                    const idInput = "valores-dojo-"+index+"-input"
                    return(<React.Fragment key={"res-val-"+resultado.muestra?.participante?.dojo?.id+"-"+index}>
                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider/>
                      </React.Fragment>)
                  })}
                  <InputLabel htmlFor={"promedio-total-dojo-input-"+resultado.id}><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                    <Rating name={"promedio-total-dojo-input-"+resultado.id} value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                  <Divider sx={{marginBottom: "5px"}}/>
                  <InputLabel>Muestras: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                </Paper>
              </div>)
            }))
          }
          {!dojoFilter&&!growFilter&&resultadoProcessed?.map((resultado)=>{
              return(
                <div key={"muestra-res"+resultado.muestraId}>
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
                        return(<Fragment key={"valores-value"+index}>
                            <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                            <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                            <Divider/>
                          </Fragment>)
                      })}
                      <InputLabel htmlFor={"promedio-total-input-"+resultado.id}><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                          <Rating name={"promedio-total-input-"+resultado.id} value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider sx={{marginBottom: "5px"}}/>
                      <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                    </Paper>
                    {showDetails&&resultado.calificaciones?.sort((a, b) => a.participante?.n>b.participante?.n).map((calificacion)=>{
                      const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                      return(<Paper sx={{padding:"5px", mr: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                          <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                          {calificacion.valores.map((currentValor, index)=>{
                            const idInput = "valores-details-"+index+"-input";
                            return(<Fragment key={"valores-details-value"+index}>
                                <InputLabel htmlFor={idInput}><span>{currentValor.label}!: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                <Divider/>
                              </Fragment>)
                          })}
                          <InputLabel htmlFor={"promedio-total-input-"+calificacion.id}><strong>Promedio Total: {calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length}</strong></InputLabel>
                          <Rating name={"promedio-total-input-"+calificacion.id} value={calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
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
