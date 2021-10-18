import { faCannabis, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Save } from "@material-ui/icons";
import { Button, Chip, Divider, Stack, TextField } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import ButtonModal from "../../components/ButtonModal";
import ConfirmModal from "../../components/ConfirmModal";
import Context from "../../context/Context";
import Page from "../Page";

export default function EditParticipante() {
  const context = useContext(Context);
  const [nombre, setNombre] = useState("");
  const { id } = useParams();

  const [muestraName, setMuestraName] = useState("");
  const [muestraDescription, setMuestraDescription] = useState("");

  const [muestras, setMuestras] = useState([
    {
      id: null,
      name:"",
      description:"",
    }
  ]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if(id){
      axios.get("/api/participante",{
        params:{
          id: id
        },
      }).then(function (response) {
        console.log(response);
        if(response.status === 200){
          context.showMessage("Participante cargado correctamente!", "success");
          const data = response?.data;
          setNombre(data?.name);
          setMuestras(data?.muestras);
        }else{
          context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
          console.error(response);  
        }
      })
      .catch(function (error) {
        context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
        console.error(error);
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const reloadParticipante = () => {
    axios.get("/api/participante",{
      params:{
        id: id
      },
    }).then(function (response) {
      console.log(response);
      if(response.status === 200){
        context.showMessage("Participante cargado correctamente!", "success");
        const data = response?.data;
        setNombre(data?.name);
        setMuestras(data?.muestras);
      }else{
        context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  }

  const onSubmit = () => {
    updateParticipante();
  };

  const updateParticipante = () => {
    axios.put("/api/participante/update",{
      id: id,
      name: nombre,
    }).then(function (response) {
      console.log(response);
      if(response.status === 200){
        context.showMessage("Participante actualizado correctamente!", "success");
        reloadParticipante();
      }else{
        context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const addMuestra = () => {
    axios.post("/api/participante/add-muestra",{
      participanteId: id,
      name: muestraName,
      description: muestraDescription,
    }).then(function (response) {
      console.log(response);
      if(response.status === 200){
        context.showMessage("Participante actualizado correctamente!", "success");
        reloadParticipante();
      }else{
        context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const deleteMuestra = (idMuestra) => {
    axios.delete("/api/participante/remove-muestra",{
      data:{
        id: idMuestra,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Muestra eliminada","success");
        reloadParticipante();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la muestra","error");
      console.log(error);
    })
  };
  
  return (
    <Page title={"Actualizar Participante - #"+id} footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <Divider>
            <Chip label="Muestras" />
          </Divider>
          {muestras?.map((muestra)=>
            <Box sx={{display: "flex", flexDirection:"row", alignItems:"center", justifyContent: "start"}}>
              <Chip
                key={muestra.hash}
                component="span"
                sx={{pl: "5px", mr: 1, backgroundColor: green[500]}}
                icon={<FontAwesomeIcon icon={faCannabis} />}
                label={<><Chip size="small" label={"#"+muestra.id} sx={{mr: 1, backgroundColor: green[300]}}/>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</>} />
              <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar la muestra?" operation={()=>{deleteMuestra(muestra.id)}}/>
            </Box>
          )}
          <ButtonModal onClick={()=>{setMuestraName(""); setMuestraDescription("");}} faIcon={faPlus} textButton="Crear Muestra" saveDisabled={!muestraName} operation={()=>{addMuestra()}}>
            <Box>
              <Divider sx={{pb:2}}>Nueva muestra</Divider>
              <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={muestraName} onChange={(e)=>setMuestraName(e?.target?.value)} />
              <TextField fullWidth id="name-input" label="Descripción" variant="outlined" sx={{mt: 2}} value={muestraDescription} onChange={(e)=>setMuestraDescription(e?.target?.value)} />
            </Box>
          </ButtonModal>
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />} onClick={()=>updateParticipante()}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
