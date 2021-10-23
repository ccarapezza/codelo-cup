import { Save } from "@material-ui/icons";
import { Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Context from "../../context/Context";
import Page from "../Page";

export default function CreateJurado() {
  let history = useHistory();
  const context = useContext(Context);
  const [nombre, setNombre] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    createJurado();
  };

  const createJurado = () => {
    axios.post("/api/participante/create-jurado",{
      name: nombre
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Jurado creado correctamente!", "success");
        history.push("/participante/jurado-list");
      }else{
        context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  return (
    <Page title="Nuevo Jurado" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
