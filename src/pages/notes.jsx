import React from "react";
import "../../sass/notes.scss";
import AreaEditable from "../../components/notes/areaEditable";
import GlobalState from "./../../context/global/globalState";
import { motion } from "framer-motion";
import useWindowSize from "../../components/hooks/useWindowSize";

import { io } from "socket.io-client";
import ToolHtml from "../../components/notes/toolHtml";
import ToolsViewMid from "../../components/notes/toolsViewMid";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

let host = "http://localhost:3000";
/* if (typeof process) {
  host = process.env.host;
} */
const socket = io(host, {
  transports: ["websocket"],
  origin: "*",
});

//const socket = io();

const Notes = ({ setVisible }) => {
  const [textHtml, setTextHtml] = React.useState("<h1>Error al iniciar</h1>");
  const [textCss, setTextCss] = React.useState(
    `<style>.content-html1 .body{color: #444;  font-family: Georgia, Palatino, "Palatino Linotype", Times, "Times New Roman", serif;  font-size: 12px;  line-height: 1.5em;  padding: 1em;  margin: 10px; padding:10px;  max-width: 42em; min-height:100%; background: #fefefe;}</style>`,
  );

  React.useEffect(() => {
    setVisible(true);
    try {
      socket.connect();
      socket.on("get text css", css => {
        setTextCss(css);
        localStorage.setItem("CssTxt", css);
      });
      socket.on("get text html", html => {
        setTextHtml(html);
        localStorage.setItem("HtmlTxt", html);
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
      <div className="container-notes">
        <Header />
        <Main textHtml={textHtml} setTextHtml={setTextHtml} textCss={textCss} />
      </div>
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

const Main = ({ textHtml, textCss, setTextHtml }) => {
  const refSelect = React.useRef(null);
  const [preValue, setPreValue] = React.useState(
    localStorage.getItem("textMarkdown"),
  );
  const [valueCss, setValueCss] = React.useState(1);
  const [change, setChange] = React.useState("mid");
  const [widthMidGeneralEdit, setWidthMidGeneralEdit] = React.useState("50%");
  const [widthMidGeneralHtml, setWidthMidGeneralHtml] = React.useState("45%");
  const [textMk, setTextMk] = React.useState("");
  const { width } = useWindowSize();

  React.useEffect(() => {
    setPreValue(localStorage.setItem("textMarkdown", textMk));

    const htmlString = marked(textMk);
    let htmlClean = cleanHtml(htmlString);
    htmlClean = htmlClean.split("<a");
    htmlClean = htmlClean.join("<a target='_blank'");
    //socket.emit("get text html", `${htmlClean}`);

    setTextHtml(htmlClean);
  }, [textMk]);
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
      setWidthMidGeneralEdit("90%");
      setWidthMidGeneralHtml("90%");
    }
  }, [width]);

  function changeStyle(e) {
    setValueCss(refSelect.current.value);
    localStorage.setItem("TypeCss", refSelect.current.value);
    socket.emit("change css", { type: e.target.value });
  }

  // manejo de la funcionalidad de framer motion
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
            setTextMk={setTextMk}
            change={change}
          />
        </motion.div>

        <ToolsViewMid actionCssView={actionCssView} />
      </motion.section>

      <motion.section
        className={`content-html1`}
        id="html"
        layout
        initial="false"
        animate={change}
        variants={html_css_variant}
      >
        <ToolHtml
          changeStyle={changeStyle}
          refSelect={refSelect}
          socket={socket}
        />

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

// funcion de sanitizacion de codigo html
const cleanHtml = html => {
  // Limpiar el código HTML utilizando la función sanitize de la librería
  const cleanHtml = sanitizeHtml(html, {
    allowedTags: [
      "p",
      "strong",
      "em",
      "img",
      "table",
      "th",
      "td",
      "tr",
      "ul",
      "ol",
      "li",
      "pre",
      "code",
      "blockquote",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
      "input",
      "button",
      "hr",
      "small",
      "select",
      "textarea",
      "option",
      "label",
      "sup",
      "span",
      "br",
      "div",
    ],
    // Permitir solo el atributo "class" en las etiquetas <p> y <strong>
    allowedAttributes: {
      p: ["class", "style"],
      strong: ["class", "style"],
      em: ["class", "style"],
      img: ["class", "style", "src", "alt"],
      table: ["class", "style"],
      th: ["class", "style"],
      td: ["class", "style"],
      tr: ["class", "style"],
      ul: ["class", "style"],
      ol: ["class", "style"],
      li: ["class", "style"],
      pre: ["class", "style"],
      code: ["class", "style"],
      blockquote: ["class", "style"],
      a: ["class", "style", "href", "target"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
      h4: ["class", "style"],
      h5: ["class", "style"],
      h6: ["class", "style"],
      input: ["class", "style", "type", "name", "value", "checked"],
      button: ["class", "style", "type", "name", "value"],
      hr: ["class", "style"],
      small: ["class", "style"],
      select: ["class", "style", "name", "value"],
      textarea: ["class", "style", "name", "value"],
      option: ["class", "style", "value"],
      label: ["class", "style", "for"],
      sup: ["class", "style"],
      span: ["class", "style"],
      div: ["class", "style"],
    },
  });

  return cleanHtml;
};
