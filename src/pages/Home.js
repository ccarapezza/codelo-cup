import { Box, Divider, InputLabel, Slider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Page from "./Page";

export default function Home() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const loadWelcomeMessage = () => {
    axios
      .get("/")
      .then(function (response) {
        // handle success
        console.log(response);
        setWelcomeMessage(response?.data?.message);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setWelcomeMessage(error?.message);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    loadWelcomeMessage();
  }, []);

  const marks = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
  ];

  return (
    <Page title="Home">
      {/*<div>
        <div>CODELO-CUP</div>
        <div>{welcomeMessage}</div>
      </div>*/}
      <Box>
        <InputLabel htmlFor="visual-input">Visual</InputLabel>
        <Slider
          id="visual-input"
          aria-label="Temperature"
          defaultValue={1}
          valueLabelDisplay="off"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />

        <InputLabel sx={{ mt: 4 }} htmlFor="aroma-input">
          Aroma
        </InputLabel>
        <Slider
          id="aroma-input"
          aria-label="Aroma"
          defaultValue={1}
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />

        <InputLabel sx={{ mt: 4 }} htmlFor="sabor-input">
          Sabor
        </InputLabel>
        <Slider
          id="sabor-input"
          aria-label="Sabor"
          defaultValue={1}
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />

        <InputLabel sx={{ mt: 4 }} htmlFor="efecto-input">
          Efecto
        </InputLabel>
        <Slider
          id="efecto-input"
          aria-label="Efecto"
          defaultValue={1}
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />
      </Box>
    </Page>
  );
}
