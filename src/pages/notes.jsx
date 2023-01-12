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
      <div className="text"></div>
    </header>
  );
};

const Main = ({ textHtml }) => {
  const [preValue, setPrevalue] = useState(
    localStorage.getItem("textMarkdown"),
  );

  const [change, setChange] = useState(false);

  const refSelect = React.useRef(null);

  React.useEffect(() => {
    setPrevalue(localStorage.getItem("textMarkdown"));
  }, [localStorage.getItem("textMarkdown")]);

  React.useEffect(() => {
    try {
      socket.on("data css", data => {
        socket.emit("change types", { typeCss: refSelect.current.value });
      });
      return () => {
        socket.removeAllListeners("data css");
      };
    } catch (error) {}
  }, []);

  const changeStyle = e => {
    setChange(!change);
    socket.emit("change css", {
      type: e.target.value,
      data: textHtml.split("</style> <br>")[1],
    });
    //alert(e.target.value)
  };

  return (
    <main className="main-notes">
      <section className="edit">
        <AreaEditable socket={socket} preValue={preValue} change={change} />
      </section>

      <section className="content-html1" id="html">
        <div className="tool-html">
          <select
            name="type_css"
            id="typeCss"
            onChange={changeStyle}
            ref={refSelect}
          >
            <option value="1">estilo 1</option>
            <option value="2">estilo 2</option>
            <option value="3">estilo 3</option>
            <option value="4">estilo 4</option>
          </select>
        </div>
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
