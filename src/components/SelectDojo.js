import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Context from '../context/Context';
import ButtonModal from './ButtonModal';

export default function SelectDojo({id="select-dojo", label="Dojo", value, onChange, selectProps, error, blankLabel=""}) {
    const context = useContext(Context)
    const [dojos, setDojos] = useState([]);

    const [dojoName, setDojoName] = useState("");

    const addNewDojo = () => {
        axios.post("/api/dojo/create", {
            name: dojoName,
        }).then(function (response) {
            console.log(response);
            if (response.status === 200) {
                const dojo = response.data;
                context.showMessage("Dojo creado correctamente!", "success");
                setDojoName("");
                setDojos(dojos.concat({id: dojo.id, name: dojo.name}));
                onChange({target:{value: dojo.id}});
            } else {
                context.showMessage("No se ha creado el Dojo. Contacte con el administrador.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("No se ha creado el Dojo. Contacte con el administrador.", "error");
            console.error(error);
        })
    };

    useEffect(() => {
        setDojos([]);
        
        axios.get("/api/dojo/list")
        .then(function (response) {
            // handle success
            if(response.status === 200){
                setDojos(response.data);
            }
        })
        .catch(function (error) {
            context.showMessage("No se pudo obtener los dojos","error");
            console.log(error);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FormControl fullWidth sx={{mt: 2, display:"flex", flexDirection: "row"}}>
            <InputLabel id={id+"-label"}>{label}</InputLabel>
            <Select 
                {...selectProps}
                fullWidth
                error={error}
                value={value}
                label={label}
                labelId={id+"-label"}
                onChange={(e)=>onChange(e)}
            >
                <MenuItem value="">{blankLabel}</MenuItem>
                {dojos?.map((dojo)=>{
                    return(
                        <MenuItem value={dojo.id}>{dojo.name}</MenuItem>
                    );
                })}
            </Select>
            <ButtonModal onClick={()=>{setDojoName("")}} faIcon={faPlus} textButton="Crear Dojo" sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!dojoName} operation={()=>{addNewDojo()}}>
                <Box>
                    <Divider sx={{pb:2}}>Nuevo dojo</Divider>
                    <TextField fullWidth id="dojo-name-input" label="Nombre" variant="outlined" value={dojoName} onChange={(e)=>setDojoName(e?.target?.value)} />                         
                </Box>
            </ButtonModal>
        </FormControl>
    )
}
