import React from "react";
import "../../sass/notes.scss";
import AreaEditable from "../../components/areaEditable";
import GlobalState from "./../../context/global/globalState";
import { globalContext } from "./../../context/global/context";
import { motion } from "framer-motion";
import useWindowSize from "../../components/hooks/useWindowSize";

import { io } from "socket.io-client";
let host = "http://localhost:3000";
/* if (typeof process) {
  host = process.env.host;
} */
/* const socket = io(host, {
  transports: ["websocket"],
  origin: "*",
}); */

const socket = io();

const Notes = ({ setVisible }) => {
  const [textHtml, setTextHtml] = React.useState("<h1>Error del servidor</h1>");
  const [textCss, setTextCss] = React.useState(
    `<style>.content-html1 .body{color: #444;  font-family: Georgia, Palatino, "Palatino Linotype", Times, "Times New Roman", serif;  font-size: 12px;  line-height: 1.5em;  padding: 1em;  margin: 10px; padding:10px;  max-width: 42em;  background: #fefefe;}</style>`,
  );

  React.useEffect(() => {
    setVisible(true);
    try {
      socket.connect();
      socket.on("get text html", html => {
        setTextHtml(html);
        localStorage.setItem("HtmlTxt", html);
      });
      socket.on("get text css", css => {
        setTextCss(css);
        localStorage.setItem("CssTxt", css);
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
  const refSelect = React.useRef(null);
  const { btn_pageNotes_viewport } = React.useContext(globalContext);
  const [preValue, setPreValue] = React.useState(
    localStorage.getItem("textMarkdown"),
  );
  const [valueCss, setValueCss] = React.useState(1);
  const [change, setChange] = React.useState("mid");
  const [widthMidGeneralEdit, setWidthMidGeneralEdit] = React.useState("50%");
  const [widthMidGeneralHtml, setWidthMidGeneralHtml] = React.useState("45%");

  const { width } = useWindowSize();

  React.useEffect(() => {
    setPreValue(localStorage.getItem("textMarkdown"));
  }, [localStorage.getItem("textMarkdown")]);
  React.useEffect(() => {
    try {
      setValueCss(refSelect.current.value);
      socket.emit("change css", { type: refSelect.current.value });
    } catch (error) {}
  }, [refSelect.current]);

  React.useEffect(() => {
    if (width > 1296) {
      setWidthMidGeneralEdit("50%");
      setWidthMidGeneralHtml("45%");
    }
    if (width <= 1296) {
      setWidthMidGeneralEdit("100%");
      setWidthMidGeneralHtml("100%");
    }
  }, [width]);

  const changeStyle = e => {
    setValueCss(refSelect.current.value);

    localStorage.setItem("TypeCss", refSelect.current.value);
    socket.emit("change css", { type: e.target.value });
  };

  const actionCssView = action => {
    setChange(action);
  };

  const edit_css_variant = {
    close: {
      width: "auto",
    },
    mid: {
      width: widthMidGeneralEdit,
      minWidth: "42em",
    },
    full: {
      width: "100%",
    },
  };

  const sub_edit_css_variant = {
    close: {
      width: "0",
      minHeight: "0",
      height: "0",
      maxHeight: "0",
      transitionEnd: {
        display: "none",
      },
    },
    mid: {
      width: "100%",
      minHeight: "95vh",
      height: "max-content",
      maxHeight: "auto",
    },
    full: {
      width: "100%",
      minHeight: "95vh",
      height: "max-content",
      maxHeight: "auto",
    },
  };

  const html_css_variant = {
    close: {
      width: "90%",
      minHeight: "95vh",
      height: "max-content",
      maxHeight: "auto",
    },
    mid: {
      width: widthMidGeneralHtml,
      minWidth: "32em",
      minHeight: "95vh",
      height: "max-content",
      maxHeight: "auto",
    },
    full: {
      width: "0",
      minHeight: "0px",
      height: "0px",
      maxHeight: "0px",
      transitionEnd: {
        display: "none",
      },
    },
  };

  return (
    <main className="main-notes">
      <motion.section
        layout
        className={`edit`}
        initial="false"
        animate={change}
        variants={edit_css_variant}
      >
        <motion.div
          className="sub-edit"
          layout
          initial="false"
          animate={change}
          variants={sub_edit_css_variant}
        >
          <AreaEditable
            socket={socket}
            preValue={preValue}
            valueCss={valueCss}
            change={change}
          />
        </motion.div>

        <div className={`tools-views `}>
          <div className="content-data-t-views">
            {btn_pageNotes_viewport
              ? btn_pageNotes_viewport.map(item => (
                  <img
                    src={item.src}
                    className="item"
                    key={item.id}
                    onClick={() => actionCssView(item.action)}
                  />
                ))
              : null}
          </div>
        </div>
      </motion.section>
      <motion.section
        className={`content-html1`}
        id="html"
        layout
        initial="false"
        animate={change}
        variants={html_css_variant}
      >
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
      </motion.section>
    </main>
  );
};
