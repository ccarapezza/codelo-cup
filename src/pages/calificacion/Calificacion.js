import React, { useState } from 'react'
import { Button, Chip, Divider, InputLabel, Paper, Rating, Stack } from '@mui/material'
import { Star } from "@material-ui/icons";
import { useParams } from 'react-router';
import Page from '../Page';
import { Box } from '@mui/system';

export default function Calificacion() {
    let { hash } = useParams();
    const [presentacion, setPresentacion] = useState(5);
    const [aromaApagado, setAromaApagado] = useState(5);
    const [aromaPrendido, setAromaPrendido] = useState(5);
    const [saborApagado, setSaborApagado] = useState(5);
    const [saborPrendido, setSaborPrendido] = useState(5);

    console.log("hash",hash);
    return (
        <Page title={<Box sx={{display:"flex", alignItems: "center"}}>Calificación <Chip sx={{ml:1, color: "white"}} size="small" variant="outlined" label={"Muestra #"+1}/></Box>} >
            <Stack >
                <InputLabel htmlFor="presentacion-input">Presentación</InputLabel>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Rating sx={{display:"flex"}} name="presentacion-input" value={presentacion} onChange={(event, value)=>{setPresentacion(value)}} max={10} />
                    <Paper sx={{p:1, ml:2, borderColor: "black", fontWeight: "bold"}} variant="outlined">{presentacion}</Paper>
                </Box>
                <Divider sx={{mt:1, mb:1}}/>

                <InputLabel htmlFor="aroma-a-input">Aroma (Apagado)</InputLabel>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Rating name="aroma-a-input" value={aromaApagado} onChange={(event, value)=>{setAromaApagado(value)}} max={10} />
                    <Paper sx={{p:1, ml:2, borderColor: "black", fontWeight: "bold"}} variant="outlined">{aromaApagado}</Paper>
                </Box>
                <Divider sx={{mt:1, mb:1}}/>

                <InputLabel htmlFor="sabor-a-input">Sabor (Apagado)</InputLabel>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Rating name="sabor-a-input" value={saborApagado} onChange={(event, value)=>{setSaborApagado(value)}} max={10} />
                    <Paper sx={{p:1, ml:2, borderColor: "black", fontWeight: "bold"}} variant="outlined">{saborApagado}</Paper>
                </Box>
                <Divider sx={{mt:1, mb:1}}/>

                <InputLabel htmlFor="aroma-p-input">Aroma (Prendido)</InputLabel>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Rating name="aroma-p-input" value={aromaPrendido} onChange={(event, value)=>{setAromaPrendido(value)}} max={10} />
                    <Paper sx={{p:1, ml:2, borderColor: "black", fontWeight: "bold"}} variant="outlined">{aromaPrendido}</Paper>
                </Box>
                <Divider sx={{mt:1, mb:1}}/>

                <InputLabel htmlFor="sabor-p-input">Sabor (Prendido)</InputLabel>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Rating name="sabor-p-input" value={saborPrendido} onChange={(event, value)=>{setSaborPrendido(value)}} max={10} />
                    <Paper sx={{p:1, ml:2, borderColor: "black", fontWeight: "bold"}} variant="outlined">{saborPrendido}</Paper>
                </Box>
                <Divider sx={{mt:1, mb:1}}/>
                <Button size="large" color="primary" variant="contained" startIcon={<Star/>} onClick={()=>{}}>
                    Calificar
                </Button>
            </Stack>
        </Page>
    )
}
