import { AddCircleOutline, Delete, Save } from "@material-ui/icons";
import { Button, Chip, Divider, IconButton, List, ListItem, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
//import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";

export default function CreateParticipante() {
  const [nombre, setNombre] = useState("");
  const [muestras, setMuestras] = useState([
    {
        name:"",
        description:"",
    }
  ]);

  const setNombreMuestra = (index, value)=>{
    setMuestras(muestras.map((element,currentIndex)=>{
      if(currentIndex!==index){
        return element;
      }else{
        return ({
            ...element,
            name: value
        })
      }
    }));
  }

  const setDescripcionMuestra = (index, value)=>{
    setMuestras(muestras.map((element,currentIndex)=>{
      if(currentIndex!==index){
        return element;
      }else{
        return ({
            ...element,
            description: value
        })
      }
    }));
  }

  const addMuestra = ()=>{
    setMuestras(currentMuestras=>{
      return currentMuestras.concat({
        name:"",
        description:"",
      });
    })
  }

  const removeMuestra = (deleteIndex)=>{ 
    setMuestras(muestras.filter((e, index)=>{
      return index!==deleteIndex;
    }))
  }

  useEffect(() => {
    
  }, []);

  return (
    <Page title="Nuevo Participante" footer={false}>
      <Stack width="100%" spacing={2}>
        <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
        <Divider>
          <Chip label="Muestras" />
        </Divider>
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {muestras.map((muestra, index)=>{
            return(
              <>
                <ListItem>
                  <Stack width="100%" spacing={2}>
                    <Box sx={{display:"flex", justifyContent:"space-between" }}>
                      <Chip label={"#"+index}/>
                      <IconButton size="small" component="span" disabled={index===0} onClick={(e)=>{removeMuestra(index)}}>
                        <Delete fontSize="small"/>
                      </IconButton>
                    </Box>
                    <TextField id="muestra-name-input" label="Nombre" variant="outlined" value={muestras[index]?.name} onChange={(e)=>setNombreMuestra(index, e?.target?.value)}/>
                    <TextField id="muestra-desc-input" label="Descripcion" variant="outlined" value={muestras[index]?.description} onChange={(e)=>setDescripcionMuestra(index, e?.target?.value)}/>
                  </Stack>
                </ListItem>
                <Divider/>
              </>
            )
          })}
          <ListItem sx={{display: "flex", justifyContent: "end"}}>
            <Button sx={{padding: "5px"}} size="small" color="success" variant="outlined" startIcon={<AddCircleOutline />} onClick={(e)=>{addMuestra()}}>
              Agregar Muestra
            </Button>
          </ListItem>
        </List>
        <Button size="large" color="primary" variant="contained" startIcon={<Save />}>
          Guardar
        </Button>
      </Stack>
    </Page>
  );
}
