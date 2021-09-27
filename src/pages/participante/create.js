import axios from "axios";
import React, { useEffect, useState } from "react";

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
    <div>
      <div>CODELO-CUP</div>
      <div>{welcomeMessage}</div>
    </div>
  );
}
