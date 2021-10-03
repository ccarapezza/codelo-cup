import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Context from "./Context";

function ContextProvider({ children }) {
  let history = useHistory();
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserDataState] = useState(JSON.parse(sessionStorage.getItem('userdata')?sessionStorage.getItem('userdata'):null));

  const [isParticipanteLogged, setIsParticipanteLogged] = useState(false);
  const [participanteData, setParticipanteDataState] = useState(JSON.parse(sessionStorage.getItem('participantedata')?sessionStorage.getItem('participantedata'):null));

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setSnackbarOpen(true);
  };

  const setUserData = (newUserData) => {
    if(newUserData){
      sessionStorage.setItem('userdata', JSON.stringify(newUserData));
    }else{
      sessionStorage.clear();
    }
    setUserDataState(newUserData);
  }

  const setParticipanteData = (newParticipanteData) => {
    if(newParticipanteData){
      sessionStorage.setItem('participantedata', JSON.stringify(newParticipanteData));
    }else{
      sessionStorage.clear();
    }
    setParticipanteDataState(newParticipanteData);
  }

  const login = (username, password) => {
    setUserData(null);
    setIsLogged(false);
    axios.post("/api/auth/signin",{
      username: username,
      password: password,
    }).then(function (response) {
      console.log(response);
      if(response.status === 200){
        console.log(response.data)
        setUserData(response.data);
        showMessage("Sesión iniciada, Bienvenido!", "success");
        history.push("/");
      }else{
        showMessage("Usuario y/o contraseña incorrectos.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      showMessage("Usuario y/o contraseña incorrectos.", "error");
      console.error(error);
    })
  }

  const logout = () => {
    setUserData(null);
    showMessage("Sesión cerrada.", "success");
    history.push("/");
  }

  useEffect(() => {
    if(userData?.accessToken){
      setIsLogged(true);
      setIsParticipanteLogged(false);
      setParticipanteData(null);
    }else{
      setIsLogged(false);
    }
  }, [userData?.accessToken]);

  useEffect(() => {
    if(participanteData?.hash){
      setIsParticipanteLogged(true);
      setIsLogged(false);
      setUserData(null);
    }else{
      setIsParticipanteLogged(false);
    }
  }, [participanteData?.hash]);

  const participanteLogin = (hash) => {
    setParticipanteData(null);
    setIsParticipanteLogged(false);
    axios.post("/api/participante/login",{
      hash: hash
    }).then(function (response) {
      console.log(response);
      if(response.status === 200){
        setParticipanteData(response.data);
        showMessage("Participante Identificado correctamente!", "success");
        history.push("/");
      }else{
        showMessage("No se ha encontrado el Participante.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      showMessage("No se ha encontrado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  return (
    <Context.Provider value={{ 
        userData: userData,
        isLogged: isLogged,
        participanteData: participanteData,
        isParticipanteLogged: isParticipanteLogged,
        showMessage: (message, severity = "info") => {
          showMessage(message, severity);
        },
        login: (username, password) => {
          login(username, password);
        },
        logout: () =>{
          logout();
        },
        participanteLogin: (hash) => {
          participanteLogin(hash);
        }
      }}>
        {children}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Context.Provider>
  );
}

export default ContextProvider;