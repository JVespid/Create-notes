import React, { useEffect, useRef, createRef } from "react";
import { globalContext } from "../context/global/context";
import Error from "./error";
import "../sass/areaEditable.scss";

let timeToConection = false;
let timeoutId;
const resetTimer = async socket => {
  const myPromise = new Promise((resolve, reject) => {
    let reult;
    if (timeToConection) {
      socket.connect();
      console.log("conexión restablecida");
      timeToConection = false;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      console.log("tiempo de espera para uso ha terminado");
      socket.disconnect();
      timeToConection = true;
    }, 10000);
  });

  console.log(await myPromise);
};
const historial = Count => {
  let temp = [];
  /* 
  if (data) {
    temp = JSON.parse(localStorage.getItem("historialArray"));
    Count += 1;
    temp[Count] = data;

    localStorage.setItem("historialArray", JSON.stringify(temp));
    localStorage.setItem("historialCount", Count);
    temp.length = 16;
    return { array: temp[Count], count: Count };
  } */

  if (Count && Count > 0) {
    Count -= 1;
    temp =
      localStorage.getItem("historialArray") &&
      localStorage.getItem("historialCount")
        ? JSON.parse(localStorage.getItem("historialArray"))
        : [];
    temp.length = 16;
    localStorage.setItem("historialCount", Count);
    return { array: temp[Count], count: Count };
  }

  temp =
    localStorage.getItem("historialArray") &&
    localStorage.getItem("historialCount")
      ? JSON.parse(localStorage.getItem("historialArray"))
      : [];

  let count =
    localStorage.getItem("historialArray") &&
    parseInt(localStorage.getItem("historialCount")) >= 0
      ? parseInt(localStorage.getItem("historialCount"))
      : -1;

  return { array: temp, count };
};

let historialCount = historial().count;

const AreaEditable = ({ preValue, socket }) => {
  const textAreaRef = useRef(null);
  const [textArea, setTextArea] = React.useState(false);

  const { array, count } = historial();
  preValue = count != -1 && array[count] ? array[count] : preValue;

  useEffect(() => {
    // esta if contiene el código que se ejecuta cuando se carga la pagina solo una vez
    if (textAreaRef.current && !textArea) {
      setTextArea(true);

      if (preValue) {
        textAreaRef.current.value = preValue;
      } else {
        socket.emit("client on", "true");
        socket.on("text markdown last save", data => {
          try {
            textAreaRef.current.value = data;
          } catch (error) {}
        });
      }
    }
    resetTimer(socket);

    textAreaRef.current.addEventListener("keydown", keyDown);
    return () => {
      //socket.removeListener("client on", "true");
      // cuando se pasa de pagina se elimina la referencia primero y por eso no se puede eliminar el evento
      resetTimer(socket);
      clearTimeout(timeoutId);

      try {
        textAreaRef.current.removeEventListener("keydown", keyDown);
        // no se puede eliminar el evento y eso esta bien0, pues cuando pasa solo se necesita que no marque error
      } catch (error) {
        socket.removeAllListeners("text markdown last save");
        socket.emit("client off", "true");
      }
    };
  }, [textAreaRef.current]);

  function keyDown(e) {
    // código para programar el tabulador
    if (e.key == "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value.split(``);

      if (start === end) {
        value.splice(start, 0, `  `);
        returnToLine(socket, start, end, value, e, 2);
      }

      if (start !== end) {
        let cantE = 1;
        for (let i = start; i >= 0; i--) {
          if (value[i] == `\n` || i == 0) {
            if (i == 0) i = -1;
            value.splice(i + 1, 0, `  `);
            break;
          }
        }
        for (let i = start; i <= end; i++) {
          if (value[i] == `\n`) {
            cantE++;
            value.splice(i + 1, 0, `  `);
          }
        }
        returnToLine(socket, start, end, value, e, 2, 2 * cantE);
      }
    }
    // codigo para programar las fabulaciones automáticas con el enter
    if (e.key == "Enter") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value.split(``);

      let spaceTotal = "";

      let space = 0,
        endLine = 0;
      for (let i = start - 1; i >= 0; i--) {
        if (value[i] == `\n`) endLine++;
        else {
          endLine = 0;
          if (value[i] == ` `) space++;
          else space = 0;
        }

        if (endLine === 1 || i === 0) {
          let spaceTotalG = "";
          for (let j = 1; j <= space; j++) {
            spaceTotal += " ";
          }
          spaceTotal += spaceTotalG;
          break;
        }
      }

      console.log(spaceTotal.length);
      //let spaceTotal = startLineInEnter(start, value);
      spaceTotal = spaceTotal ? spaceTotal : "";
      value.splice(start, 0, "\n" + spaceTotal);
      returnToLine(socket, start, end, value, e, spaceTotal.length + 1);
    }
    // codigo para hacer el control z
    if (e.keyCode == 90 && e.ctrlKey) {
      e.preventDefault();
      if (historialCount > 0) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const { array, count } = historial(historialCount);
        historialCount = count;
        console.log(array, count, historialCount);

        returnToLine(socket, start, end, array, e, 1, false, false);
      }
    }
  }

  const keyPress = e => {
    configTollsGlobals(e, socket);
  };

  return (
    <>
      {textArea ? (
        <Tools textArea={textAreaRef} socket={socket} />
      ) : (
        <Error
          name="Error al cargar"
          message="No se pudo cargar las herramientas de edición, pruebe recargando la pagina"
          type="error"
        />
      )}
      <div className="text-area">
        <textarea
          onChange={keyPress}
          ref={textAreaRef}
          placeholder="# ingresa tu texto aquí"
          autoCorrect="on"
        ></textarea>
      </div>
    </>
  );
};

export default AreaEditable;

// componentes utilizados en el componente principal
// area de los subcomponentes del componente principal
const BtnToll = ({ value, link, data, actionMain, subAction, socket }) => {
  const refDetails = createRef(null);
  const [stateDetails, setStateDetails] = React.useState(`close`);
  const [classDetails, setClassDetails] = React.useState(``);
  const [classControls, seClassControls] = React.useState(``);
  // sirve para hacer un diseño dinámico mas legible al solo cambiar ciertas clases
  const details = data => {
    if (stateDetails == "open") {
      if (data == 2) refDetails.current.removeAttribute("open");
      setStateDetails(`close`);
      setClassDetails(``);
      seClassControls(``);
    } else {
      setStateDetails(`open`);
      seClassControls(`block-controls-visible`);
      setClassDetails(`open`);
    }
  };

  if (!link && !actionMain) return null;

  return (
    <>
      {data && subAction ? (
        <div
          className={`block-controls ${classControls}`}
          onClick={() => details(2)}
        ></div>
      ) : null}

      <div className="content-btn">
        {actionMain ? (
          <>
            <img
              className="toll-main"
              onClick={() => actionMain(value)}
              src={link}
            />
          </>
        ) : null}

        {data && subAction ? (
          <details
            className={`details ${classDetails}`}
            state="close"
            ref={refDetails}
          >
            <summary onClick={details}> </summary>
            {data.map((item, index) => (
              <div
                key={item.id}
                className="item"
                data="item"
                onClick={() => {
                  details(2);
                  subAction(item.value);
                }}
                dangerouslySetInnerHTML={{ __html: item.html }}
              ></div>
            ))}
          </details>
        ) : null}
      </div>
    </>
  );
};

// componente hecho para separar el componente de las herramientas pues sera grande
// recordar que si no hay por lo menos un elemento en el array de las funciones de funcionamiento principal no se obtendrá datos del contexto y no se compilara el componente (recuerde siempre crear un componente principal para el componente del componente)
const Tools = ({ textArea, socket }) => {
  const { tools } = React.useContext(globalContext);

  // sección de las funciones de funcionamiento principal:--------------

  const ListType_TYPE_MAIN = e => {
    const start = textArea.current.selectionStart;
    const end = textArea.current.selectionEnd;
    let value = textArea.current.value.split("");
    let movements = 0,
      movementsStart = 0;

    if (start !== end) {
      for (let i = start - 1; i < end; i++) {
        if (value[i] == "\n") {
          value.splice(i + 1, 0, `${e} `);
          movements++;
        }
      }

      for (let i = start - 1; i >= 0; i--) {
        if (value[i] == "\n") {
          value.splice(i + 1, 0, `${e} `);
          movementsStart++;
          movements++;
          break;
        }

        if (i == 0) {
          value.splice(0, 0, `${e} `);
          movementsStart++;
          movements++;
          break;
        }
      }
    }

    if (start === end) {
      for (let i = start; i >= 0; i--) {
        if (i == 0 || value[i] == "\n") {
          value.splice(i, 0, `${e} `);
          movementsStart++;
          movements++;
          break;
        }
      }
    }
    returnToLine(
      socket,
      start,
      end,
      value,
      textArea,
      (e.length + 1) * movementsStart,
      (e.length + 1) * movements
    );
  };

  const Locked_TYPE_MAIN = e => {
    const start = textArea.current.selectionStart;
    const end = textArea.current.selectionEnd;
    let value = textArea.current.value.split("");

    if (start !== end && e !== "```") {
      //value.splice(start, 0, `> `);
      //value.splice(end + 2, 0, ``);

      value.splice(start, 0, `${e}`);
      value.splice(end + 1, 0, `${e}`);
      returnToLine(socket, start, end, value, textArea, e.length);
      return;
    }

    if (start == end && e !== "```") {
      //value.splice(start, 0, `> `);
      value.splice(start, 0, `${e} ${e}`);
      returnToLine(socket, start, end, value, textArea, e.length, e.length + 1);
      return;
    }

    if (start != end && e == "```") {
      value.splice(start, 0, `${e}\n`);
      value.splice(end + 1, 0, `\n${e}`);
      returnToLine(socket, start, end, value, textArea, e.length + 1);
      return;
    }

    if (start == end && e == "```") {
      value.splice(start, 0, `${e}\n \n${e}`);
      returnToLine(
        socket,
        start,
        end,
        value,
        textArea,
        e.length + 1,
        e.length + 2
      );
      return;
    }
  };

  const Links_TYPE_MAIN = e => {
    const type = e[0] == "!" ? "imagen" : "link";
    const initial = e[0] == "!" ? "![" : "[";
    const description =
      type == "imagen" ? `esto es una imagen` : `esto es un Link`;

    let link = prompt(`ingresa el link de la ${type} a insertar`);
    link = link.trim() ? link : `Ingresa_aquí_tu_enlace_a_tu_${type}`;

    const start = textArea.current.selectionStart;
    const end = textArea.current.selectionEnd;
    let value = textArea.current.value.split("");

    if (start !== end) {
      value.splice(start, 0, `${initial}`);
      value.splice(end + 1, 0, `](${link})`);
      returnToLine(socket, start, end, value, textArea, initial.length);
      return;
    }

    if (start == end) {
      value.splice(start, 0, `${initial}${description}](${link})`);
      returnToLine(
        socket,
        start,
        end,
        value,
        textArea,
        initial.length,
        initial.length + description.length
      );
    }
  };

  // sección de las funciones de funcionamiento secundario----------------------

  // estos array son para guardar las funciones que se ejecutaran en los botones
  // este array tiene que estar en orden como en el contexto
  const actionMain = [
    ListType_TYPE_MAIN,
    ListType_TYPE_MAIN,
    ListType_TYPE_MAIN,
    Locked_TYPE_MAIN,
    Locked_TYPE_MAIN,
    Locked_TYPE_MAIN,
    ListType_TYPE_MAIN,
    Locked_TYPE_MAIN,
    Links_TYPE_MAIN,
    Links_TYPE_MAIN,
  ];
  // si no hay un componente secundario, rellenar el espacio con un null y solo si hay un componente principal
  // este array tiene que estar en orden como en el contexto
  const subAction = [
    ListType_TYPE_MAIN,
    ListType_TYPE_MAIN,
    ListType_TYPE_MAIN,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  return (
    <>
      <div className="tools">
        {/* botones de las herramientas de diseño */}

        {tools.map((item, index) => {
          if (actionMain[index] == undefined) return null;

          return (
            <BtnToll
              key={item.id}
              link={item.link}
              value={item.value}
              data={item.data}
              actionMain={actionMain[index]}
              subAction={subAction[index]}
              indexGlobal={index}
              socket={socket}
            />
          );
        })}
      </div>
    </>
  );
};

// elementos ejecutados al presionar algún botón

// codigo para imprimir el texto en el area editable con el puntero en el lugar correcto
const returnToLine = (socket, start, end, value, e, cantS, cantE, saveInfo) => {
  cantE = cantE ? cantE : cantS;
  saveInfo = saveInfo != undefined ? saveInfo : true;
  const type = e.target ? "target" : "current";

  if (typeof value == "object") {
    e[`${type}`].value = value.join(``);
  } else e[`${type}`].value = value;

  e[`${type}`].selectionStart = start + cantS;
  e[`${type}`].selectionEnd = end + cantE;

  if (saveInfo) configTollsGlobals(e, socket);
  e[`${type}`].focus();
};

//guarda todos los valores en la variable global historialArray para su uso en el comando
const configTollsGlobals = (e, socket) => {
  const { array, count } = historial();
  resetTimer(socket);

  let historialCount = count,
    historialArray = array;
  console.log(historialArray, historialCount);

  const type = e.target ? "target" : "current";

  if (historialCount < historialArray.length - 1) historialCount++;
  else {
    for (let i = 0; i < historialArray.length; i++) {
      historialArray[i] = historialArray[i + 1];
    }
  }

  historialArray[historialCount] = e[`${type}`].value;
  localStorage.setItem("textMarkdown", e[`${type}`].value);
  localStorage.setItem("historialArray", JSON.stringify(historialArray));
  localStorage.setItem("historialCount", historialCount);
  socket.emit("text markdown", e[`${type}`].value);
};
