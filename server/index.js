//const { createServer } = require('vite')
const { marked } = require("marked");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);

const io = socketIo(server);

const routeMain = require("./routes/routeMain");

const publicPath = path.join(__dirname, "..", "dist");
//const publicPath_2 = path.join(__dirname, "assets");

app.use(express.static(publicPath));
//app.use(express.static(publicPath_2));

app.use(
  cors({
    origin: ["http://127.0.0.1:5173/", "http://localhost:5173/"],
  }),
);

app.use("/", routeMain);

io.on("connection", socket => {
  let limit = 0,
    typeStl = 1;

  let textCss = fs.readFileSync(
    path.join(__dirname, "assets", `css-${typeStl}.txt`),
    "utf8",
  );

  console.log("a user connected in this server");

  socket.on("client on", msg => {
    if (msg == "true" && limit == 0) {
      limit++;

      const TextHTML = fs.readFileSync(
        path.join(__dirname, "assets", "html-default.txt"),
        "utf8",
      );
      const TextMK = fs.readFileSync(
        path.join(__dirname, "assets", "markdown-default.txt"),
        "utf8",
      );

      socket.emit("text markdown last save", TextMK);
      socket.emit("text html last save", `${textCss} \n ${TextHTML}`);
    }
  });

  socket.on("text markdown", markdownText => {
    // código markdown para convertir a html
    socket.emit("data css", "true");
    const htmlString = marked(markdownText);
    const htmlClean = cleanHtml(htmlString);
    socket.emit("text html", `${textCss} <br> ${htmlClean}`);
  });

  socket.on("change css", ({ type, data }) => {
    const { css, typeCss } = changeCss(type);
    textCss = css;
    typeStl = typeCss;
    const htmlClean = cleanHtml(data);
    socket.emit("change info", true);
    socket.emit("text html", `${css} <br> ${htmlClean}`);
  });

  socket.on("reconnected", data => {
    socket.emit("data css", "true");
  });

  socket.on("change types", ({ typeCss }) => {
    if (typeCss) {
      const { css } = changeCss(typeCss);
      typeStl = typeCss;
      textCss = css;
    } else typeStl = 1;
    console.log(typeStl, "hola");
  });

  socket.on("client off", type => {
    limit = 0;
  });

  socket.on("disconnect", type => {
    limit = 0;
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

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

const changeCss = type => {
  const typeCss = type;
  const css = fs.readFileSync(
    path.join(__dirname, "assets", `css-${type}.txt`),
    "utf8",
  );
  return { css, typeCss };
};
