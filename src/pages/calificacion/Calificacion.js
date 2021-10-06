import React, { useContext, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Chip, Divider, IconButton, InputLabel, Paper, Rating, Stack } from '@mui/material'
import { Star } from "@material-ui/icons";
import Page from '../Page';
import { Box } from '@mui/system';
import QrReader from 'react-qr-reader';
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSquareFull, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useHistory } from 'react-router';

export default function Calificacion() {
    let history = useHistory();
    const context = useContext(Context);

    const [camera, setCamera] = useState("environment");

    const [hashMuestra, setHashMuestra] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validarMuestra = () => {
        setLoading(true);
        axios.post("/api/participante/validar-muestra", {
            hash: hashMuestra
        }).then(function (response) {
            console.log(response);
            if (response.status === 200) {
                context.showMessage("Participante creado correctamente!", "success");
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
    };

    const calificarMuestra = () => {
        setLoading(true);
        axios.post("/api/participante/calificar", {
            hash: hashMuestra,
            presentacion: presentacion,
            aromaPrendido: aromaPrendido,
            aromaApagado: aromaApagado,
            saborPrendido: saborPrendido,
            saborApagado: saborApagado
        }).then(function (response) {
            console.log(response);
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
            validarMuestra(data);
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

    return (
        <Page
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    Calificación {hashMuestra && !error && <Chip sx={{ ml: 1, color: "white" }} size="small" variant="outlined" label={"Muestra #" + 1} />}
                </Box>} >
            {loading ?
                <Loading />
                : hashMuestra && !error ?
                    <Stack >
                        <InputLabel htmlFor="presentacion-input">Presentación</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating sx={{ display: "flex" }} name="presentacion-input" value={presentacion} onChange={(event, value) => { setPresentacion(value) }} max={10} />
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold" }} variant="outlined">{presentacion}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="aroma-a-input">Aroma (Apagado)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating name="aroma-a-input" value={aromaApagado} onChange={(event, value) => { setAromaApagado(value) }} max={10} />
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold" }} variant="outlined">{aromaApagado}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="sabor-a-input">Sabor (Apagado)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating name="sabor-a-input" value={saborApagado} onChange={(event, value) => { setSaborApagado(value) }} max={10} />
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold" }} variant="outlined">{saborApagado}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="aroma-p-input">Aroma (Prendido)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating name="aroma-p-input" value={aromaPrendido} onChange={(event, value) => { setAromaPrendido(value) }} max={10} />
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold" }} variant="outlined">{aromaPrendido}</Paper>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        <InputLabel htmlFor="sabor-p-input">Sabor (Prendido)</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating name="sabor-p-input" value={saborPrendido} onChange={(event, value) => { setSaborPrendido(value) }} max={10} />
                            <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold" }} variant="outlined">{saborPrendido}</Paper>
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
                            subheader="Escanee el codigo de la muestra para calificarla"
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
