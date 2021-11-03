import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Chip, Divider, IconButton, InputLabel, Paper, Rating, Stack, FormControlLabel, Slider, Switch } from '@mui/material'
import { Star } from "@material-ui/icons";
import Page from '../Page';
import { Box } from '@mui/system';
import QrReader from 'react-qr-reader';
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSlidersH, faSquareFull, faStar, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useHistory, useParams } from 'react-router';
import { red } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';

export default function Calificacion() {
    let history = useHistory();
    const context = useContext(Context);
    const { calificacionHash } = useParams();

    const [camera, setCamera] = useState("environment");

    const [hashMuestra, setHashMuestra] = useState(calificacionHash);
    const [idMuestra, setIdMuestra] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validarMuestra = useCallback((hash) => {
        setIdMuestra(null);
        setLoading(true);
        axios.post("/api/participante/validar-muestra", {
            hashMuestra: hash
        }).then(function (response) {
            if (response.status === 200) {
                const data = response.data;
                const calificacion = data?.calificacion;
                setIdMuestra(data.muestraN);
                if(calificacion){
                    setPresentacion(calificacion.presentacion);
                    setAromaApagado(calificacion.aromaApagado);
                    setAromaPrendido(calificacion.aromaPrendido);
                    setSaborApagado(calificacion.saborApagado);
                    setSaborPrendido(calificacion.saborPrendido);
                    context.showMessage("Muestra identificada! Ya calificó esta muestra pero puede actualizarla.", "warning");
                }else{
                    context.showMessage("Muestra identificada!", "success");
                }
            } else {
                context.showMessage("No se ha podido validar la muestra.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            setHashMuestra();
            context.showMessage("No se ha podido validar la muestra.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    },[context])

    const calificarMuestra = () => {
        setLoading(true);
        axios.post("/api/participante/calificar", {
            hashMuestra: hashMuestra,
            presentacion: presentacion,
            aromaPrendido: aromaPrendido,
            aromaApagado: aromaApagado,
            saborPrendido: saborPrendido,
            saborApagado: saborApagado
        }).then(function (response) {
            if (response.status === 200) {
                context.showMessage("Calificación guardada!", "success");
                history.push("/");
            } else {
                context.showMessage("Error al guardar la calificación.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            context.showMessage("Error al guardar la calificación.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    };

    const switchCamera = () => {
        setCamera(camera === "environment" ? "user" : "environment");
    };

    const handleScan = (data) => {
        if (data) {
            setHashMuestra(data);
        }
    };

    const handleError = (err) => {
        setError(err);
        context.showMessage("Error accediendo a su cámara", "error");
        console.error(err);
    };

    const [presentacion, setPresentacion] = useState(5);
    const [aromaApagado, setAromaApagado] = useState(5);
    const [aromaPrendido, setAromaPrendido] = useState(5);
    const [saborApagado, setSaborApagado] = useState(5);
    const [saborPrendido, setSaborPrendido] = useState(5);

    const [starView, setStarView] = useState(true);

    useEffect(() => {
        if(hashMuestra){
            validarMuestra(hashMuestra)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashMuestra])

    const marks = [
        { value: 1, label: '1'},
        { value: 2, label: '2'},
        { value: 3, label: '3'},
        { value: 4, label: '4'},
        { value: 5, label: '5'},
        { value: 6, label: '6'},
        { value: 7, label: '7'},
        { value: 8, label: '8'},
        { value: 9, label: '9'},
        { value: 10, label: '10'},
    ];

    return (
        <Page
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    Calificación 
                    {idMuestra && !error && <Chip sx={{ ml: 1, color: "white" }} size="small" variant="outlined" label={"Muestra #" + idMuestra} />}
                    {calificacionHash && !error && <Chip sx={{ ml: 1 }} color="primary" size="small" variant="outlined" label={""} />}
                </Box>} >
            {loading ?
                <Loading />
                : idMuestra && !error ?
                    <Stack >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", my:0, py:0 }}>
                            <Typography>Modo:</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mx: 2, my:0}}>
                                <FontAwesomeIcon icon={faSlidersH} style={{margin:0, padding: 0}}/>
                                <FormControlLabel
                                    sx={{flexGrow: 1, whiteSpace:"nowrap", mx:0, px:0, textAlign: "center", display: "inline", alignSelf: "center"}}
                                    control={<Switch size="small" color="default" checked={starView} onChange={(e)=>{setStarView(e.target?.checked)}} sx={{color:red[500], mx:0}} />}
                                    label={""}
                                />
                                <FontAwesomeIcon icon={faStar} style={{margin:0, padding: 0}}/>
                            </Box>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />
                        <InputLabel htmlFor="presentacion-input">Presentación</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {starView?
                                <Rating sx={{ display: "flex" }} name="presentacion-input" value={presentacion} onChange={(event, value) => { setPresentacion(value?value:presentacion) }} max={10} />
                                :
                                <Slider valueLabelDisplay="auto" step={.5} marks={marks} min={1} sx={{ display: "flex" }} name="presentacion-input" value={presentacion} onChange={(event, value) => { setPresentacion(value?value:presentacion) }} max={10} />
                            }
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{presentacion.toFixed(1)}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="aroma-a-input">Aroma (En flor)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {starView?
                                <Rating name="aroma-a-input" value={aromaApagado} onChange={(event, value) => { setAromaApagado(value?value:aromaApagado) }} max={10} />
                                :
                                <Slider valueLabelDisplay="auto" step={.5} marks={marks} min={1} name="aroma-a-input" value={aromaApagado} onChange={(event, value) => { setAromaApagado(value?value:aromaApagado) }} max={10} />
                            }
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{aromaApagado.toFixed(1)}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="aroma-p-input">Aroma (Picadura)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {starView?
                                <Rating name="aroma-p-input" value={aromaPrendido} onChange={(event, value) => { setAromaPrendido(value?value:aromaPrendido) }} max={10} />
                            :
                                <Slider valueLabelDisplay="auto" step={.5} marks={marks} min={1} name="aroma-p-input" value={aromaPrendido} onChange={(event, value) => { setAromaPrendido(value?value:aromaPrendido) }} max={10} />
                            }
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{aromaPrendido.toFixed(1)}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="sabor-a-input">Sabor (Apagado)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {starView?
                                <Rating name="sabor-a-input" value={saborApagado} onChange={(event, value) => { setSaborApagado(value?value:saborApagado) }} max={10} />
                            :
                                <Slider valueLabelDisplay="auto" step={.5} marks={marks} min={1} name="sabor-a-input" value={saborApagado} onChange={(event, value) => { setSaborApagado(value?value:saborApagado) }} max={10} />
                            }
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{saborApagado.toFixed(1)}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />


                        <InputLabel htmlFor="sabor-p-input">Sabor (Encendido)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {starView?
                                <Rating name="sabor-p-input" value={saborPrendido} onChange={(event, value) => { setSaborPrendido(value?value:saborPrendido) }} max={10} />
                            :
                                <Slider valueLabelDisplay="auto" step={.5} marks={marks} min={1} name="sabor-p-input" value={saborPrendido} onChange={(event, value) => { setSaborPrendido(value?value:saborPrendido) }} max={10} />
                            }
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{saborPrendido.toFixed(1)}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />
                        <Button size="large" color="primary" variant="contained" startIcon={<Star />} onClick={() => { calificarMuestra() }}>
                            Calificar
                        </Button>
                    </Stack>
                    :
                    <Card>
                        <CardHeader
                            sx={{ pb: 0 }}
                            subheader="Escaneé el código de la muestra para calificarla"
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
                                    <button onClick={(e)=>{validarMuestra()}}>Login</button>
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
