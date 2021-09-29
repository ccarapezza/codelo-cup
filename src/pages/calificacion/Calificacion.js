import React from 'react'
import { InputLabel, Rating, Slider } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router';
import Page from '../Page';

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
    console.log("hash",hash);
    return (
        <Page title="Calificación" >
            <Box>
                <InputLabel htmlFor="visual-input">Visual</InputLabel>
                <Slider
                id="visual-input"
                aria-label="Temperature"
                defaultValue={1}
                valueLabelDisplay="off"
                step={1}
                marks={marks}
                min={1}
                max={10}
                />

                <InputLabel sx={{ mt: 4 }} htmlFor="aroma-input">
                Aroma
                </InputLabel>
                <Rating name="aroma-input" defaultValue={5} max={10} /><span>5</span>

                <InputLabel sx={{ mt: 4 }} htmlFor="sabor-input">
                Sabor
                </InputLabel>
                <Slider
                id="sabor-input"
                aria-label="Sabor"
                defaultValue={1}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={1}
                max={10}
                />

                <InputLabel sx={{ mt: 4 }} htmlFor="efecto-input">
                Efecto
                </InputLabel>
                <Slider
                id="efecto-input"
                aria-label="Efecto"
                defaultValue={1}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={1}
                max={10}
                />
            </Box>
        </Page>
    )
}
