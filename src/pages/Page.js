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
import { faCannabis, faChair, faHome, faListAlt, faPollH, faQrcode, faSignOutAlt, faSquare, faSyncAlt, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { deepOrange } from "@mui/material/colors";

export default function Page({ title, children, footer = true, style }) {
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
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
              <ListItem button key={"new-player"} onClick={(e)=>{history.push("/participante/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Listado Participantes"} />
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
      <Container sx={{ p: 2, mb:footer && context.isParticipanteLogged?8:2, ...style }}>{children}</Container>
      {footer && context.isParticipanteLogged &&
        <AppBar position="fixed" color="secondary" sx={{ top: "auto", bottom: 0 }}>
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
              Participante
            </Typography>
            <Typography variant="h5" component="div">
              <Chip variant={"outlined"} label={"#"+context.participanteData?.id} sx={{ mr: 1, bgcolor: deepOrange[500], color:"white!important" }}/>{context.participanteData?.name}
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
