import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu } from "@material-ui/icons";
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Paper } from "@mui/material";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import Context from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faChair, faGavel, faHome, faKey, faListAlt, faPollH, faQrcode, faSearch, faSignOutAlt, faSquare, faSyncAlt, faTags, faUser, faUserPlus, faVihara } from "@fortawesome/free-solid-svg-icons";
import { deepOrange, indigo, yellow } from "@mui/material/colors";
import Loading from "../components/Loading";

export default function Page({ title, children, footer = true, style, loading = false }) {
  const context = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
            onClick={(e) => {
              setMenuOpen(true);
            }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{display: "flex", alignItems: "center", flexGrow: 1 }}>
            {title}
            {context.isJuradoLogged&&
              <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: indigo[500]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                <Typography sx={{fontSize: "0.6rem"}}>Jurado</Typography>
              </Box>}/>
            }
            {context.isLogged&&
              <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: yellow[900]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                <FontAwesomeIcon icon={faKey} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                <Typography sx={{fontSize: "0.6rem"}}>Admin</Typography>
              </Box>}/>
            }
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      >
        <Box sx={{ width: 250 }} role="presentation"
          onClick={() => {
            setMenuOpen(false);
          }}
          onKeyDown={() => {
            setMenuOpen(false);
          }}
        >
          <List>
            <ListItem button key={"home"} onClick={(e)=>history.push("/")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faHome} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Inicio"} />
            </ListItem>
            {context.isParticipanteLogged?
              <>
                <ListItem button key={"refresh-participante"} onClick={(e)=>history.push("/login")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-3x">
                      <FontAwesomeIcon icon={faUser} transform="shrink-6 left-2"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-10 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Cambiar Participante"} />
                </ListItem>
                <ListItem button key={"calificar-muestra"} onClick={(e)=>history.push("/calificacion")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-3x">
                      <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Calificar Muestra"} />
                </ListItem>
                {context.isJuradoLogged&&
                  <ListItem button key={"consultar-muestra"} onClick={(e)=>history.push("/calificaciones/muestra")}>
                    <ListItemIcon>
                      <span className="fa-layers fa-fw fa-3x">
                        <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                        <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                        <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                      </span>
                    </ListItemIcon>
                    <ListItemText primary={"Consultar Muestra"} />
                  </ListItem>
                }
                <ListItem button key={"logout"} onClick={(e)=>context.logout()}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-3x">
                      <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Cerrar Sesión"} />
                </ListItem>
              </>
              :!context.isLogged&&
              <ListItem button key={"participante-login"} onClick={(e)=>history.push("/login")}>
                <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faUser} transform="shrink-6 left-3"/>
                  <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                  <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4 left-2"/>
                </span>
                </ListItemIcon>
                <ListItemText primary={"Ingresar"} />
              </ListItem>
            }
          </List>
          {context.isLogged&&
            <List>
              <Divider key={"admin-menu-title"}>
                <Chip label="Menú Administrador" color="primary"/>
              </Divider>
              <ListItem button key={"create-player"} onClick={(e)=>{history.push("/participante/create")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faUserPlus} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Nuevo Participante"} />
              </ListItem>
              <ListItem button key={"participante-list"} onClick={(e)=>{history.push("/participante/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Listado Participantes"} />
              </ListItem>
              <ListItem button key={"create-jurado"} onClick={(e)=>{history.push("/participante/create-jurado")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faGavel} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Nuevo Jurado"} />
              </ListItem>
              <ListItem button key={"jurado-list"} onClick={(e)=>{history.push("/participante/jurado-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Listado Jurados"} />
              </ListItem>
              <ListItem button key={"dojo-list"} onClick={(e)=>{history.push("/dojo/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faVihara} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Listado Dojos"} />
              </ListItem>
              <ListItem button key={"categoria-list"} onClick={(e)=>{history.push("/categoria/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faTags} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Listado Categorias"} />
              </ListItem>
              <ListItem button key={"participante-qr-list"} onClick={(e)=>{history.push("/participante/qr-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faUser} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"QRs Participantes"} />
              </ListItem>
              <ListItem button key={"muestra-qr-list"} onClick={(e)=>{history.push("/muestra/qr-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faCannabis} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"QRs Muestras"} />
              </ListItem>
              <ListItem button key={"resultados"} onClick={(e)=>{history.push("/calificaciones/resultados")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faPollH} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Resultados"} />
              </ListItem>
              <ListItem button key={"consultar-muestra"} onClick={(e)=>{history.push("/calificaciones/muestra")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                    <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Consultar Muestra"} />
              </ListItem>
              <ListItem button key={"mesas-manager"} onClick={(e)=>{history.push("/mesas-manager")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faChair} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Mesas"} />
              </ListItem>
              <ListItem button key={"logout"} onClick={(e)=>{context.logout()}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Cerrar Sesión"} />
              </ListItem>
            </List>
          }
        </Box>
      </Drawer>
      <Container sx={{ p: 2, mb:footer && context.isParticipanteLogged?8:2, ...style }}>
        {loading?
          <Loading/>
        :
          children
        }
      </Container>
      {footer && context.isParticipanteLogged &&
        <AppBar position="fixed" color="secondary" sx={{ top: "auto", bottom: 0 }}>
          <Box sx={{ p: 1 }}>
            {context.isJuradoLogged?
              <Chip variant="outlined" size="small" sx={{color: "white"}} label={<Box sx={{display: "flex", alignItems: "center", px: 1}}>
                <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "1rem"}}/>
                <Typography sx={{fontSize: "1rem"}}>Jurado</Typography>
              </Box>}/>
              :
              <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                Participante
              </Typography>

            }
            <Typography variant="h5" component="div">
              <Chip variant={"outlined"} label={"#"+context.participanteData?.n} sx={{ mr: 1, bgcolor: deepOrange[500], color:"white!important" }}/>{context.participanteData?.name}
            </Typography>
            {context.participanteData?.mesa&&
              <Paper variant={"outlined"} sx={{width: "fit-content", mt: 1, px: 1, bgcolor: "transparent", borderColor:"white!important"}}>
                <Typography sx={{ fontSize: ".9rem", fontWeight: "bold", color:"white!important"}} color="text.secondary">
                  {context.participanteData?.mesa?.name}
                </Typography>
              </Paper>
            }
          </Box>
        </AppBar>
      }
    </>
  );
}
