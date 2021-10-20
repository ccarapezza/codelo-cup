import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Context from '../context/Context';

export default function SelectCategoria({id="select-categoria", label="Categoría", value, onChange, selectProps, error, blankLabel=""}) {
    const context = useContext(Context)
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([]);
        
        axios.get("/api/categoria/list")
        .then(function (response) {
            // handle success
            if(response.status === 200){
                setCategorias(response.data);
            }
        })
        .catch(function (error) {
            context.showMessage("No se pudo obtener los participantes","error");
            console.log(error);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FormControl fullWidth sx={{mt: 2}}>
            <InputLabel id={id+"-label"}>{label}</InputLabel>
            <Select 
                {...selectProps}
                error={error}
                value={value}
                label={label}
                labelId={id+"-label"}
                onChange={(e)=>onChange(e)}
            >
                <MenuItem value="">{blankLabel}</MenuItem>
                {categorias?.map((categoria)=>{
                    return(
                        <MenuItem value={categoria.id}>{categoria.name}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )
}
