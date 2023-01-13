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
  const [textCss, setTextCss] = useState(
    `<style>.content-html1 .body{color: #444;  font-family: Georgia, Palatino, "Palatino Linotype", Times, "Times New Roman", serif;  font-size: 12px;  line-height: 1.5em;  padding: 1em;  margin: 10px; padding:10px;  max-width: 42em;  background: #fefefe;}</style>`,
  );

  React.useEffect(() => {
    setVisible(true);
    try {
      socket.connect();
      socket.on("get text html", html => {
        setTextHtml(html);
      });
      socket.on("get text css", css => {
        setTextCss(css);
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
      <Main textHtml={textHtml} textCss={textCss} />
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

const Main = ({ textHtml, textCss }) => {
  const [preValue, setPreValue] = useState(
    localStorage.getItem("textMarkdown"),
  );

  const [valueCss, setValueCss] = useState(1);
  const refSelect = React.useRef(null);

  React.useEffect(() => {
    setPreValue(localStorage.getItem("textMarkdown"));
  }, [localStorage.getItem("textMarkdown")]);

  React.useEffect(() => {
    try {
      setValueCss(refSelect.current.value);
      socket.emit("change css", { type: refSelect.current.value });
    } catch (error) {}
  }, [refSelect.current]);

  const changeStyle = e => {
    setValueCss(refSelect.current.value);
    socket.emit("change css", { type: e.target.value });
  };

  return (
    <main className="main-notes">
      <section className="edit">
        <AreaEditable socket={socket} preValue={preValue} valueCss={valueCss} />
      </section>

      <section className="content-html1" id="html">
        <div className="tool-html">
          <div className="content-select">
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
        </div>

        <div className="html">
          <div
            className="body"
            dangerouslySetInnerHTML={{ __html: `${textCss} <br> ${textHtml}` }}
          ></div>
        </div>
      </section>
    </main>
  );
};
