import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu, PersonAdd, ListAlt } from "@material-ui/icons";
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from "@mui/material";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import Context from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faHome, faQrcode, faSignOutAlt, faSquare, faSyncAlt, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Page({ title, children, footer = true }) {
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
                <span className="fa-layers fa-fw fa-2x">
                  <FontAwesomeIcon icon={faHome} />
                </span>
              </ListItemIcon>
              <ListItemText primary={"Inicio"} />
            </ListItem>
            {context.isParticipanteLogged?
              <>
                <ListItem button key={"refresh-participante"} onClick={(e)=>history.push("/login")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-3x">
                      <FontAwesomeIcon icon={faUser} transform="shrink-6 left-3"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-10 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Cambiar Participante"} />
                </ListItem>
                <ListItem button key={"calificar-muestra"} onClick={(e)=>history.push("/")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-3x">
                      <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Calificar Muestra"} />
                </ListItem>
              </>
              :
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
              <Divider>
                <Chip label="Administración" />
              </Divider>
              
              <ListItem button key={"create-player"} onClick={(e)=>history.push("/participante/create")}>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary={"Nuevo Participante"} />
              </ListItem>
              <ListItem button key={"list-players"} onClick={(e)=>history.push("/participante/list")}>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary={"Listado Participantes"} />
              </ListItem>
              <ListItem button key={"logout"} onClick={(e)=>context.logout()}>
                <ListItemIcon>
                  <FontAwesomeIcon style={{padding:"5px"}} icon={faSignOutAlt} />
                </ListItemIcon>
                <ListItemText primary={"Cerrar Sesión"} />
              </ListItem>
            </List>
          }
        </Box>
      </Drawer>
      <Container sx={{ p: 2, pl: 3, pr: 3 }}>{children}</Container>
      {footer && context.isParticipanteLogged &&
        <AppBar position="fixed" color="transparent" sx={{ top: "auto", bottom: 0 }}>
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Participante
            </Typography>
            <Typography variant="h5" component="div">
              {context.participanteData?.name}
            </Typography>
            <Typography color="text.secondary">#{context.participanteData?.id}</Typography>
          </Box>
        </AppBar>
      }
    </>
  );
}
