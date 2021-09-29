import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu, Sync, Mail } from "@material-ui/icons";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import { useHistory } from "react-router";

export default function Page({ title, children, footer = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
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
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => {
            setMenuOpen(false);
          }}
          onKeyDown={() => {
            setMenuOpen(false);
          }}
        >
          <List>
            <ListItem
              button
              key={"change-player"}
              onClick={(e) => {
                history.push("/login");
              }}
            >
              <ListItemIcon>
                <Sync />
              </ListItemIcon>
              <ListItemText primary={"Cambiar participante"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={"Test2"}>
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary={"Test2"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Container sx={{ p: 2, pl: 3, pr: 3 }}>{children}</Container>
      {footer&&
        <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
            <Card>
            <CardContent>
                <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
                >
                Participante
                </Typography>
                <Typography variant="h5" component="div">
                Jorge Juarez
                </Typography>
                <Typography color="text.secondary">#1234</Typography>
            </CardContent>
            </Card>
        </AppBar>
      }
    </>
  );
}
