import React, { useState } from 'react'
import { InputLabel, Paper, Rating, Stack } from '@mui/material'
import { useParams } from 'react-router';
import Page from '../Page';
import { Box } from '@mui/system';

const marks = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
];

export default function Calificacion() {
    let { hash } = useParams();
    const [presentacion, setPresentacion] = useState();
    const [aromaApagado, setAromaApagado] = useState();
    const [aromaPrendido, setAromaPrendido] = useState();
    const [saborApagado, setSaborApagado] = useState();
    const [saborPrendido, setSaborPrendido] = useState();

    console.log("hash",hash);
    return (
        <Page title="Calificación" >
            <Stack spacing={2}>
                <InputLabel htmlFor="presentacion-input">Presentación</InputLabel>
                <Box sx={{display:"flex"}}>
                    <Rating name="presentacion-input" size="large" value={5} onChange={(event, value)=>{setPresentacion(value)}} max={10} />
                    <Paper variant="outlined">{presentacion}</Paper>
                </Box>

                <InputLabel htmlFor="aroma-input">Aroma (Apagado)</InputLabel>
                <Rating name="aroma-input" size="large" defaultValue={5} max={10} /><span>5</span>

                <InputLabel htmlFor="aroma-input">Aroma (Prendido)</InputLabel>
                <Rating name="aroma-input" size="large" defaultValue={5} max={10} /><span>5</span>

                <InputLabel htmlFor="sabor-input">Sabor (Apagado)</InputLabel>
                <Rating name="aroma-input" size="large" defaultValue={5} max={10} /><span>5</span>

                <InputLabel htmlFor="sabor-input">Sabor (Prendido)</InputLabel>
                <Rating name="aroma-input" size="large" defaultValue={5} max={10} /><span>5</span>
            </Stack>
        </Page>
    )
}
