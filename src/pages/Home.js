import { FormControl, InputLabel, MenuItem, Select, Slider } from "@mui/material";
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

  return (
    <Page title="Home">
      <div>
        <div>CODELO-CUP</div>
        <div>{welcomeMessage}</div>
      </div>
      <Slider
        aria-label="Temperature"
        defaultValue={1}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={10}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Visual</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={0}
          label="Age"
          onChange={()=>{}}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
    </Page>
  );
}
