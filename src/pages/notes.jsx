import React, { useState } from "react";
import "../../sass/notes.scss";
import AreaEditable from "../../components/areaEditable";
import GlobalState from "./../../context/global/globalState";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000/", {
  transports: ["websocket"],
  origin: "*",
});

//const socket = io();

const Notes = ({ setVisible }) => {
  const [textHtml, setTextHtml] = useState("<h1> bienvenido al chat </h1>");

  React.useEffect(() => {
    setVisible(true);
    try {
      socket.connect();
      socket.on("text html", html => {
        setTextHtml(html);
      });
    } catch (error) {}

    return () => {
      try {
        socket.removeAllListeners("text markdown last save");
        socket.disconnect();
      } catch (error) {}
    };
  }, []);

  return (
    <GlobalState>
      <Header />
      <Main textHtml={textHtml} />
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

const Main = ({ textHtml }) => {
  const [preValue, setPrevalue] = useState(
    localStorage.getItem("textMarkdown")
  );

  React.useEffect(() => {
    setPrevalue(localStorage.getItem("textMarkdown"));
  }, [localStorage.getItem("textMarkdown")]);

  return (
    <main className="main-notes">
      <section className="edit">
        <AreaEditable socket={socket} preValue={preValue} />
      </section>
      <div className="btn-move"></div>
      <section className="content-html1">
        <div className="temp"></div>
        <div className="html">
          <div
            className="body"
            dangerouslySetInnerHTML={{ __html: textHtml }}
          ></div>
        </div>
      </section>
    </main>
  );
};
