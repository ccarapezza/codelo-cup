
import { Avatar, Button, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTags, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Box } from "@mui/system";
import CategoriaColors from "../../CategoriaColors";
import Context from "../../context/Context";
import ButtonModal from "../../components/ButtonModal";
import ConfirmModal from "../../components/ConfirmModal";
import { Search } from "@material-ui/icons";

export default function ListCategoria() {
  const context = useContext(Context);
  const [categorias, setCategorias] = useState([]);
  const [categoriaName, setCategoriaName] = useState("");
  const [searchField, setSearchField] = useState("");

  const listAllCategorias = () => {
    setCategorias();
    axios.get("/api/categoria/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCategorias(response.data.map((categoria)=>{
          return({
            ...categoria,
            labels: categoria.labels?.split(",")
          })
        }));
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  };

  const deleteCategoria = (idCategoria) => {
    axios.delete("/api/categoria/delete",{
      data:{
        id: idCategoria,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Categoría eliminada","success");
        listAllCategorias();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la Categoría","error");
      console.log(error);
    })
  };

  const updateCategoria = (idCategoria) => {
    axios.put("/api/categoria/update",{
      id: idCategoria,
      name: categoriaName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Categoría actualizada","success");
        listAllCategorias();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la Categoría","error");
      console.log(error);
    })
  };

  const createCategoria = () => {
    axios.post("/api/categoria/create", {
        name: categoriaName,
    }).then(function (response) {
        if (response.status === 200) {
            context.showMessage("Categoría creada correctamente!", "success");
            setCategoriaName("");
            listAllCategorias();
        } else {
            context.showMessage("No se ha creado la Categoría. Contacte con el administrador.", "error");
            console.error(response);
        }
    })
    .catch(function (error) {
        context.showMessage("No se ha creado la Categoría. Contacte con el administrador.", "error");
        console.error(error);
    })
  };

  useEffect(() => {
    listAllCategorias();
  }, []);

  return (
    <Page title="Listado Categorias" footer={false}>
      {categorias?.length!==0?
        <>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:"100%" }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={"Buscar..."}
                inputProps={{ 'aria-label': 'Buscar Participante'}}
                value={searchField}
                onChange={(e)=>setSearchField(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <ButtonModal onClick={()=>{setCategoriaName("")}} faIcon={faPlus} sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!categoriaName} operation={()=>{createCategoria()}}>
                <Box>
                    <Divider sx={{pb:2}}>Nueva Categoría</Divider>
                    <TextField fullWidth id="dojo-name-input" label="Nombre" variant="outlined" size="small" value={categoriaName} onChange={(e)=>setCategoriaName(e?.target?.value)} />                         
                </Box>
            </ButtonModal>
          </Box>
          <Divider sx={{my: 1}}/>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {categorias?.filter(dojo => (dojo.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((categoria)=>{
              return(
                <div key={"dojo-list-element-"+categoria.id}>
                  <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box sx={{display: "flex"}}>
                      <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                        <Avatar sx={{backgroundColor: CategoriaColors[categoria.id]}}>
                          <FontAwesomeIcon icon={faTags}/>
                        </Avatar>
                      </ListItemAvatar>
                      <Stack>
                        <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{categoria.name}</Typography>} />
                        {categoria.labels.map((label)=>
                          <small sx={{pr:2}}>-{label}</small>
                        )}
                      </Stack>
                    </Box>
                    <Box>
                      <ButtonModal onClick={()=>{setCategoriaName(categoria.name)}} faIcon={faEdit} textButton="" sx={{whiteSpace: "nowrap", mr: 1}} saveDisabled={!categoriaName} operation={()=>{updateCategoria(categoria.id)}}>
                        <Box>
                            <Divider sx={{pb:2}}>Editar Categoría</Divider>
                            <TextField fullWidth id="categoria-name-input" label="Nombre" variant="outlined" size="small" value={categoriaName} onChange={(e)=>setCategoriaName(e?.target?.value)} />                         
                            <Divider sx={{pb:2}}/>
                            <Typography variant="subtitle2" sx={{pt:1}}>Valores:</Typography>
                            {categoria.labels.map((label, index)=>
                              <Box key={"categoria-valor-"+index} sx={{display:"flex", flexDirection: "row", pl:3}}>
                                <TextField fullWidth id={"categoria-valor-input-"+index} label="Valor" variant="outlined" size="small" value={label} onChange={()=>{}} />
                                <Button onClick={()=>{}}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </Button>
                              </Box>
                            )}
                        </Box>
                      </ButtonModal>
                      <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar el Dojo?" operation={()=>{deleteCategoria(categoria.id)}}/>
                    </Box>
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
          </List>
        </>
        :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No se encontraron categorias"/></h2>
        </Box>
      }
    </Page>
  );
}
