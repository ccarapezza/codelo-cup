import React, { useContext, useState } from 'react'
import { Button, Card, CardContent, CardHeader, IconButton, Rating, Stack, Chip, Divider, InputLabel, Paper, Accordion, AccordionDetails, AccordionSummary, alpha, Grid, Typography } from '@mui/material'
import Page from '../Page';
import { Box } from '@mui/system';
import QrReader from 'react-qr-reader';
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCircle, faClock, faSquareFull, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading';
import { Radar } from 'react-chartjs-2';
import ComparatorColors from '../../ComparatorColors';
import { ExpandMore } from '@material-ui/icons';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@material-ui/core';
import { Fragment } from 'react';

export default function ConsultaCalificacion() {
    const context = useContext(Context);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const [camera, setCamera] = useState("environment");
    
    const [verGrafico, setVerGrafico] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [promedio, setPromedio] = useState({
        labels: [],
        datasets: [],
    });

    const [promedioData, setPromedioData] = useState([]);

    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: "bold"
                    }
                }
            },
        },
        scale: {
            angleLines: {
                display: true,
                lineWidth: 0.5,
                color: 'rgba(128, 128, 128, 0.2)'
            },
            pointLabels: {
                fontSize: 14,
                fontStyle: '500',
                fontColor: 'rgba(204, 204, 204, 1)',
                fontFamily: "'Lato', sans-serif"
            }
        },
        scales: {
            r: {
                min: 1,
                max: 10,
                ticks: {
                    stepSize: 2
                },
                pointLabels: {
                    font: {
                        size: 14,
                    }
                  }
            }
        }
    }

    const addMuestra = (muestraData, labels) => {
        let equalLabels = true;
        if(promedio.labels.length>0){
            if (promedio.labels.length !== labels.length){
                equalLabels = false;
            }
            for (var i = 0; i < promedio.labels.length; i++) {
                if (promedio.labels[i] !== labels[i]){
                    equalLabels = false;
                }
            }
        }
        if(equalLabels){
            setPromedio({
                labels: labels,
                datasets: promedio.datasets.concat(muestraData)
            })
        }else{
            context.showMessage("No se pueden comparar las muestras", "error");
        }
    }

    const validarMuestra = (hash) => {
        setVerGrafico(true);
        setLoading(true);
        axios.post("/api/calificaciones/muestra", {
            hashMuestra: hash
        }).then(function (response) {
            if (response.status === 200) {
                const calificacionesData = response.data?.calificaciones;
                let muestraId = 0;
                const promedioDataResponse = [calificacionesData.reduce(function(m, d){
                    if(!m){
                        m = {
                            ...d,
                            count: 1,
                            promedioTotal: (d.valores.reduce((previousValue, currentValue)=>previousValue.valor+currentValue.valor, 0) / d.valores.length),
                            calificaciones: []
                        };
                        muestraId = d.muestra.id;
                        delete d.muestra;
                        m.calificaciones.push(d);
                        return m;
                    }
                    m.valores = m.valores.map((currentValor, index)=>{
                        currentValor.valor += d.valores[index].valor;
                        return currentValor.valor;
                    });
                    m.promedioTotal = d.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / d.valores.length;
                    m.count += 1;
                    delete d.muestra;
                    m.calificaciones.push(d);
                    return m;
                },null)].map((calificacion)=>{
                    if(calificacion){
                        return({
                          ...calificacion,
                          valores: calificacion.valores.map((currentValor)=>{
                            return({
                              ...currentValor,
                              valor: Math.round(currentValor/calificacion.count * 10) / 10
                            })
                          }),
                          promedioTotal: Math.round(calificacion.promedioTotal/calificacion.count * 10) / 10
                        })
                    }else{
                        return(null);
                    }
                })[0];

                if(promedioDataResponse){
                    setPromedioData(promedioData.concat(promedioDataResponse));
                    addMuestra(
                        {
                            label: 'Muestra #'+muestraId,
                            data: promedioDataResponse.valores.map(currentValor=>currentValor.valor),
                            backgroundColor: alpha(ComparatorColors[promedio?.datasets.length], 0.2),
                            borderColor: ComparatorColors[promedio?.datasets.length],
                            lineTension: 0.1,
                            pointBackgroundColor: ComparatorColors[promedio?.datasets.length],
                            pointBorderColor: "rgba(255, 255, 255, 1)",
                            pointRadius: 4,
                            pointHoverRadius: 6,
                        },
                        promedioDataResponse.valores.map(currentValor=>currentValor.label)
                    );
                    context.showMessage("Muestra identificada!", "success");
                }else{
                    context.showMessage("Muestra identificada pero aun no posee calificaciones", "warning");
                }
            } else {
                context.showMessage("No se ha podido validar la muestra.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            //setHashMuestra();
            context.showMessage("No se ha podido validar la muestra.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    }

    const switchCamera = () => {
        setCamera(camera === "environment" ? "user" : "environment");
    };

    const handleScan = (data) => {
        if (data) {
            //setHashMuestra(data);
            validarMuestra(data)
        }
    };

    const handleError = (err) => {
        setError(err);
        context.showMessage("Error accediendo a su cámara", "error");
        console.error(err);
    };

    /*useEffect(() => {
        if(hashMuestra){
            validarMuestra(hashMuestra)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashMuestra])*/

    return (
        <Page
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    Consulta Calificación
                </Box>} >
            
            {loading ?
                <Loading />
                : verGrafico && !error ?
                    <Stack>
                        {promedioData?.length>0?
                            <Radar data={promedio} options={options} />
                            :
                            <Box sx={{ display: "flex", justifyContent: "center"}}>
                                <h2><Chip label="Aún hay Calificaciones disponibles"/></h2>
                            </Box>
                        }
                        <Button fullWidth variant="outlined" color="primary" onClick={()=>setVerGrafico(false)}>Comparar</Button>
                        <Divider sx={{mt: 2, mb:2}}/>
                        {promedioData.map((currentPromedio, index)=>{
                            return(currentPromedio&&<div key={"promedio-"+index}>
                                <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <FontAwesomeIcon icon={faCircle} color={ComparatorColors[index]} style={{alignSelf: "center", marginRight: 10}}/><Typography color={ComparatorColors[index]}>Detalles Muestra #{currentPromedio.muestra.n}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack>
                                            <Paper sx={{p:1, mt: 1}} variant="outlined">
                                                <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                                                {currentPromedio.valores.map((currentValor, index)=>{
                                                    const idInput = "valores-promedio-"+index+"-input"
                                                    return(<Fragment key={idInput+"key"}>
                                                        {JSON.stringify(currentPromedio)}
                                                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                                        <Divider/>
                                                    </Fragment>)
                                                })}
                                                <Divider sx={{marginBottom: "5px"}}/>
                                                <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{currentPromedio.count}</strong></InputLabel>
                                            </Paper>
                                            <Grid container>
                                                {currentPromedio.calificaciones?.map((calificacion, index)=>{
                                                    const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                                                    return(
                                                        <Grid item xs={matches?6:12} key={"calificacion-"+calificacion?.id} >
                                                            <Paper sx={{p: 1, ml: matches?(index%2):0, mt: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                                                                <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                                                                {calificacion.valores.map((currentValor, indexCalificacion)=>{
                                                                    const idInput = "valores-prom-cal-"+index+"-"+indexCalificacion+"-input";
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
                                                            </Paper>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </div>);
                        })}
                    </Stack>
                    :
                    <Card>
                        <CardHeader
                            sx={{ pb: 0 }}
                            subheader="Escaneé el código de la muestra para consultar sus calificaciones"
                            action={
                                <IconButton aria-label="settings" onClick={(e) => { switchCamera() }}>
                                    <span className="fa-layers fa-fw fa-2x fa-dark">
                                        <FontAwesomeIcon icon={faCamera} />
                                        <FontAwesomeIcon icon={faSquareFull} transform="shrink-4 down-1" />
                                        <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-8 down-1" />
                                    </span>
                                </IconButton>
                            } />
                        <CardContent>
                            {/*
                                <div>
                                    <input type="text" value={hashMuestra} onChange={(e)=>{setHashMuestra(e.target.value)}} />
                                    <button onClick={(e)=>{validarMuestra(hashMuestra)}}>Login</button>
                                </div>
                                <div>QR RESULT:{hashMuestra}</div>
                                <div>{JSON.stringify(error)}</div>
                            */}
                            <QrReader
                                facingMode={camera}
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                            />
                        </CardContent>
                    </Card>
            }
        </Page>
    )
}
