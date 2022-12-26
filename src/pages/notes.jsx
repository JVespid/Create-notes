import React, { useState } from "react";
import "../../sass/notes.scss";
import AreaEditable from "../../components/areaEditable";
import GlobalState from "./../../context/global/globalState";

import { io } from "socket.io-client";
/* const socket = io("http://localhost:3000/", {
  transports: ["websocket"],
  origin: "*",
}); */

const socket = io();
const Notes = ({ setVisible }) => {
  React.useEffect(() => {
    setVisible(true);
    try {
      socket.connect();
    } catch (error) {}

    return () => {
      try {
        socket.disconnect();
      } catch (error) {}
    };
  }, []);

  return (
    <GlobalState>
      <Header />
      <Main />
    </GlobalState>
  );
};

export default Notes;

const Header = () => {
  return (
    <header className="header">
      <div className="text">
        <h2>Todo List </h2>
        <h3> Descripción: </h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
          optio voluptatum repellendus voluptas nulla velit consectetur enim,
        </p>
      </div>
    </header>
  );
};

const Main = () => {
  const [preValue, setPrevalue] = useState(
    localStorage.getItem("textMarkdown")
  );

  React.useEffect(() => {
    setPrevalue(localStorage.getItem("textMarkdown"));
  }, [localStorage.getItem("textMarkdown")]);

  return (
    <main className="main">
      <section className="groups-and-notes"> </section>

      <section className="edit">
        <AreaEditable socket={socket} preValue={preValue} />
      </section>
    </main>
  );
};
