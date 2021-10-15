
import { Avatar, Button, Chip, Divider, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Paper, Rating, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "../Page";
import { visuallyHidden } from '@mui/utils';
import { Edit } from "@material-ui/icons";
import { faClock, faEye, faEyeSlash, faSortAmountDown, faSortAmountUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";
import { deepOrange } from '@mui/material/colors';

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  let history = useHistory();

  useEffect(() => {
    axios.get("/api/calificaciones/resultados")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        const calificaciones = response.data?.calificaciones;
        setResultados(calificaciones.reduce(function(m, d){
          if(!m[d.muestraId]){
            m[d.muestraId] = {...d, count: 1, calificaciones: []};
            delete d.muestra;
            m[d.muestraId].calificaciones.push(d);
            return m;
          }
          m[d.muestraId].presentacion += d.presentacion;
          m[d.muestraId].aromaPrendido += d.aromaPrendido;
          m[d.muestraId].aromaApagado += d.aromaApagado;
          m[d.muestraId].saborPrendido += d.saborPrendido;
          m[d.muestraId].saborApagado += d.saborApagado;
          m[d.muestraId].count += 1;
          delete d.muestra;
          m[d.muestraId].calificaciones.push(d);
          return m;
       },{}));
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }, []);
  
  
  
  
  
  const headCells = [
    {
      id: 'presentacion',
      numeric: true,
      label: 'Muestra',
    },
    {
      id: 'presentacion',
      numeric: true,
      label: 'Presentación',
    },
    {
      id: 'aromaApagado',
      numeric: true,
      label: 'Aroma (En flor)',
    },
    {
      id: 'aromaPrendido',
      numeric: true,
      label: 'Aroma (Picadura)',
    },
    {
      id: 'saborApagado',
      numeric: true,
      label: 'Sabor (Apagado)',
    },
    {
      id: 'saborPrendido',
      numeric: true,
      label: 'Sabor (Encendido)',
    },
  ];

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  //Custom Table Start
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  const EnhancedTable = ()=>{
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [dense, setDense] = React.useState(false);
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleChangeDense = (event) => {
      setDense(event.target.checked);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={Object.keys(resultados).length}
              />


              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(Object.keys(resultados).map((k)=>resultados[k]), getComparator(order, orderBy))
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.muestraId}
                      >
                        <TableCell align="right">{"#"+row.muestraId}</TableCell>
                        <TableCell align="right">{row.presentacion}</TableCell>
                        <TableCell align="right">{row.aromaApagado}</TableCell>
                        <TableCell align="right">{row.aromaPrendido}</TableCell>
                        <TableCell align="right">{row.saborApagado}</TableCell>
                        <TableCell align="right">{row.saborPrendido}</TableCell>
                        <TableCell align="right">
                          <Grid container>
                            {row.calificaciones?.map((calificacion)=>{
                              const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                              return(<Grid item xs={12} key={row?.muestra?.hash} paddingBottom="10px">
                                <Paper sx={{padding:"5px"}} elevation={3}>
                                  <Divider sx={{pb:"5px"}}><Chip color="secondary" label={`Muestra #${row.muestra.id}`}/></Divider>
                                  <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{calificacion.presentacion}</strong></InputLabel>
                                  <Rating name="presentacion-input" value={calificacion.presentacion} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <Divider/>
                                  <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaApagado}</strong></InputLabel>
                                  <Rating name="aromaApagado-input" value={calificacion.aromaApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaPrendido}</strong></InputLabel>
                                  <Rating name="aromaPrendido-input" value={calificacion.aromaPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <Divider/>
                                  <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{calificacion.saborPrendido}</strong></InputLabel>
                                  <Rating name="saborPrendido-input" value={calificacion.saborPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{calificacion.saborApagado}</strong></InputLabel>
                                  <Rating name="saborApagado-input" value={calificacion.saborApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <Divider sx={{marginBottom: "5px"}}/>
                                  <Box sx={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                                    <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toTimeString().split(' ')[0]}</span></div>
                                  </Box>
                                </Paper>
                              </Grid>)
                            })}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    );
  }
  //Custom Table End

  const [showDetails, setShowDetails] = useState(false);
  const [orderValue, setOrderValue] = useState("presentacion");
  const [sortOrder, setSortOrder] = useState(0);

  return (
    <Page title="Resultados" footer={false}>
        <Divider>Ordenar por:</Divider>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", margin: 2}} direction="row" spacing={1}>
          <Button color="secondary" variant={orderValue==="presentacion"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("presentacion"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="presentacion"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Presentación
          </Button>
          <Button color="secondary" variant={orderValue==="aromaApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaApagado"); setSortOrder(sortOrder?0:1)}}>
          {orderValue==="aromaApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Aroma Apagado
          </Button>
          <Button color="secondary" variant={orderValue==="aromaPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("aromaPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="aromaPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Aroma Prendido
          </Button>
          <Button color="secondary" variant={orderValue==="saborPrendido"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborPrendido"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborPrendido"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Sabor Prendido
          </Button>
          <Button color="secondary" variant={orderValue==="saborApagado"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("saborApagado"); setSortOrder(sortOrder?0:1)}}>
            {orderValue==="saborApagado"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
            Sabor Apagado
          </Button>
        </Stack>
        <Divider/>
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {Object.keys(resultados).map((k)=>resultados[k])
            .sort(function(a, b) {
              if (a[orderValue] > b[orderValue]) {
                return sortOrder?1:-1;
              }
              if (a[orderValue] < b[orderValue]) {
                return sortOrder?-1:1;
              }
              return 0;
            })
            .map((resultado)=>{
              return(
                <div key={resultado.muestraId}>
                  <ListItem>
                    <ListItemAvatar sx={{display:"flex", flexDirection:"column", alignItems:"center", margin: 2}}>
                      <Avatar sx={{ width: 74, height: 74, bgcolor: deepOrange[500] }}>
                        <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <h6 style={{padding:0, margin: 0}}>Muestra</h6>
                          <h2 style={{padding:0, margin: 0}}>{"#"+resultado.muestraId}</h2>
                        </Stack>
                      </Avatar>
                      <h5 style={{padding:0, margin: 0}}>{resultado?.muestra?.name}</h5>
                      <Paper elevation={3} sx={{display:"flex", flexDirection:"column", alignItems:"center", padding: 1, marginTop: 2}}>
                        <h6 style={{padding:0, margin:0}}>Participante</h6>
                        <Typography variant="h6" component="div">{"#"+resultado?.muestra?.participante?.id+" - "+resultado?.muestra?.participante?.name}</Typography>
                      </Paper>
                    </ListItemAvatar>
                    
                    <Paper sx={{padding:"5px", marginRight: "20px"}} elevation={4}>
                      <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                      <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{resultado.presentacion}</strong></InputLabel>
                      <Rating name="presentacion-input" value={resultado.presentacion} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                      <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{resultado.aromaApagado}</strong></InputLabel>
                      <Rating name="aromaApagado-input" value={resultado.aromaApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{resultado.aromaPrendido}</strong></InputLabel>
                      <Rating name="aromaPrendido-input" value={resultado.aromaPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                      <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{resultado.saborPrendido}</strong></InputLabel>
                      <Rating name="saborPrendido-input" value={resultado.saborPrendido} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{resultado.saborApagado}</strong></InputLabel>
                      <Rating name="saborApagado-input" value={resultado.saborApagado} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider sx={{marginBottom: "5px"}}/>
                      <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                    </Paper>
                    {showDetails?
                      <Stack sx={{padding:"5px", marginRight: "20px"}}>
                        <IconButton aria-label="delete" onClick={()=>{setShowDetails(false)}}>
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </IconButton>
                        <Typography variant="h10">Ocultar detalles</Typography>
                      </Stack>
                    :
                    <Stack sx={{padding:"5px", marginRight: "20px"}}>
                      <IconButton aria-label="delete" onClick={()=>{setShowDetails(true)}}>
                        <FontAwesomeIcon icon={faEye} />
                      </IconButton>
                      <Typography variant="h10">Ver detalles</Typography>
                    </Stack>
                    }
                    {showDetails&&resultado.calificaciones?.map((calificacion)=>{
                      const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                      return(
                        <Paper sx={{padding:"5px"}} elevation={1}>
                          <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.id} - ${calificacion.participante?.name}`}/></Divider>
                          <InputLabel htmlFor="presentacion-input"><span>Presentación: </span><strong style={{paddingLeft:"5px"}}>{calificacion.presentacion}</strong></InputLabel>
                          <Rating name="presentacion-input" value={calificacion.presentacion} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider/>
                          <InputLabel htmlFor="aromaApagado-input">Aroma (En flor): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaApagado}</strong></InputLabel>
                          <Rating name="aromaApagado-input" value={calificacion.aromaApagado} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <InputLabel htmlFor="aromaPrendido-input">Aroma (Picadura): <strong style={{paddingLeft:"5px"}}>{calificacion.aromaPrendido}</strong></InputLabel>
                          <Rating name="aromaPrendido-input" value={calificacion.aromaPrendido} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider/>
                          <InputLabel htmlFor="saborPrendido-input">Sabor (Prendido): <strong style={{paddingLeft:"5px"}}>{calificacion.saborPrendido}</strong></InputLabel>
                          <Rating name="saborPrendido-input" value={calificacion.saborPrendido} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <InputLabel htmlFor="saborApagado-input">Sabor (Apagado): <strong style={{paddingLeft:"5px"}}>{calificacion.saborApagado}</strong></InputLabel>
                          <Rating name="saborApagado-input" value={calificacion.saborApagado} max={10} readOnly sx={{fontSize: "1rem"}}/>
                          <Divider sx={{marginBottom: "5px"}}/>
                          <Box sx={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                            <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toTimeString().split(' ')[0]}</span></div>
                          </Box>
                        </Paper>
                      )
                    })}
                    
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
        </List>
    </Page>
  );
}
