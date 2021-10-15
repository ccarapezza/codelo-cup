import { AddCircleOutline, Delete, Save } from "@material-ui/icons";
import { Button, Chip, Divider, IconButton, List, ListItem, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Context from "../../context/Context";
import Page from "../Page";

export default function CreateParticipante() {
  const context = useContext(Context);
  const [nombre, setNombre] = useState("");
  const [muestras, setMuestras] = useState([
    {
      name:"",
      description:"",
    }
  ]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    createParticipante();
  };

  const createParticipante = () => {
    axios.post("/api/participante/create",{
      name: nombre,
      muestras: muestras,
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Participante creado correctamente!", "success");
        clearForm();
      }else{
        context.showMessage("No se ha creado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha creado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

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

  const clearForm = ()=>{ 
    setNombre("");
    setMuestras([
      {
          name:"",
          description:"",
      }
    ]);
  }

  return (
    <Page title="Nuevo Participante" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <Divider>
            <Chip label="Muestras" />
          </Divider>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {muestras.map((muestra, index)=>{
              return(
                <div key={index}>
                  <ListItem>
                    <Stack width="100%" spacing={2}>
                      <Box sx={{display:"flex", justifyContent:"space-between" }}>
                        <Chip label={"#"+(index+1)}/>
                        <IconButton size="small" component="span" disabled={index===0} onClick={(e)=>{removeMuestra(index)}}>
                          <Delete fontSize="small"/>
                        </IconButton>
                      </Box>
                      <TextField {...register("muestra-name-input"+index, { required: true })} error={errors["muestra-name-input"+index]} label="Nombre" variant="outlined" value={muestras[index]?.name} onChange={(e)=>setNombreMuestra(index, e?.target?.value)}/>
                      <TextField id="muestra-desc-input" label="Descripcion" variant="outlined" value={muestras[index]?.description} onChange={(e)=>setDescripcionMuestra(index, e?.target?.value)}/>
                    </Stack>
                  </ListItem>
                  <Divider/>
                </div>
              )
            })}
            <ListItem sx={{display: "flex", justifyContent: "end"}}>
              <Button sx={{padding: "5px"}} size="small" color="success" variant="outlined" startIcon={<AddCircleOutline />} onClick={(e)=>{addMuestra()}}>
                Agregar Muestra
              </Button>
            </ListItem>
          </List>
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
