import React, { useRef, createRef } from "react";
import { globalContext } from "../../context/global/context";
import BtnList from "./btnList";
import Error from "../error";
import "../../sass/areaEditable.scss";

let timeToConnection = false;
let timeoutId;

const resetTimer = async socket => {
  const myPromise = new Promise((resolve, reject) => {
    if (timeToConnection) {
      socket.connect();
      timeToConnection = false;
      console.log("conectado");
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      socket.disconnect();
      console.log("desconectado");
      timeToConnection = true;
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

    localStorage.setItem("historialArray",JSON.stringify(temp));
    localStorage.setItem("historialCount",Count);
    temp.length = 16;
    return { array: temp[Count],count: Count };
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

const AreaEditable = ({ preValue, valueCss, socket, setTextMk }) => {
  const textAreaRef = useRef(null);
  const [textArea, setTextArea] = React.useState(false);
  const { array, count } = historial();
  preValue = count != -1 && array[count] ? array[count] : preValue;

  React.useEffect(() => {
    if (textAreaRef.current && !textArea) {
      setTextArea(true);
      if (preValue) {
        textAreaRef.current.value = preValue;
      }
    }
    textAreaRef.current.addEventListener("keydown", keyDown);

    return () => {
      clearTimeout(timeoutId);

      try {
        textAreaRef.current.removeEventListener("keydown", keyDown);
      } catch (error) {}
    };
  }, [textAreaRef.current]);

  React.useEffect(() => {}, [valueCss]);

  function keyDown(e) {
    // c??digo para programar el tabulador
    if (e.key == "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value.split(``);

      if (start === end) {
        value.splice(start, 0, `  `);
        returnToLine(setTextMk, start, end, value, e, 2);
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
        returnToLine(setTextMk, start, end, value, e, 2, 2 * cantE);
      }
    }
    // codigo para programar las fabulaciones autom??ticas con el enter
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

      //let spaceTotal = startLineInEnter(start,value);
      spaceTotal = spaceTotal ? spaceTotal : "";
      value.splice(start, 0, "\n" + spaceTotal);
      returnToLine(setTextMk, start, end, value, e, spaceTotal.length + 1);
    }
    // codigo para hacer el control z
    if (e.keyCode == 90 && e.ctrlKey) {
      e.preventDefault();
      if (historialCount > 0) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const { array, count } = historial(historialCount);
        historialCount = count;

        returnToLine(setTextMk, start, end, array, e, 1, false, false);
      }
    }
  }

  const keyPress = e => {
    //socket.emit("text markdown", e.target.value);
    setTextMk(e.target.value);
    configTollsGlobals(e, socket);
  };

  return (
    <>
      {textArea ? (
        <Tools textArea={textAreaRef} />
      ) : (
        <Error
          name="Error al cargar"
          message="No se pudo cargar las herramientas de edici??n,pruebe recargando la pagina"
          type="error"
        />
      )}
      <div className="text-area">
        <textarea
          onChange={keyPress}
          ref={textAreaRef}
          placeholder="# ingresa tu texto aqu??"
          autoCorrect="on"
        ></textarea>
      </div>
    </>
  );
};

export default AreaEditable;

// componente hecho para separar el componente de las herramientas pues sera grande
// recordar que si no hay por lo menos un elemento en el array de las funciones de funcionamiento principal no se obtendr?? datos del contexto y no se compilara el componente (recuerde siempre crear un componente principal para el componente del componente)
const Tools = ({ textArea }) => {
  const { tools_mk } = React.useContext(globalContext);

  // secci??n de las funciones de funcionamiento principal:--------------

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
      setTextMk,
      start,
      end,
      value,
      textArea,
      (e.length + 1) * movementsStart,
      (e.length + 1) * movements,
    );
  };

  const Locked_TYPE_MAIN = e => {
    const start = textArea.current.selectionStart;
    const end = textArea.current.selectionEnd;
    let value = textArea.current.value.split("");

    if (start !== end && e !== "```") {
      //value.splice(start,0,`> `);
      //value.splice(end + 2,0,``);

      value.splice(start, 0, `${e}`);
      value.splice(end + 1, 0, `${e}`);
      returnToLine(setTextMk, start, end, value, textArea, e.length);
      return;
    }

    if (start == end && e !== "```") {
      //value.splice(start,0,`> `);
      value.splice(start, 0, `${e} ${e}`);
      returnToLine(
        setTextMk,
        start,
        end,
        value,
        textArea,
        e.length,
        e.length + 1,
      );
      return;
    }

    if (start != end && e == "```") {
      value.splice(start, 0, `${e}\n`);
      value.splice(end + 1, 0, `\n${e}`);
      returnToLine(setTextMk, start, end, value, textArea, e.length + 1);
      return;
    }

    if (start == end && e == "```") {
      value.splice(start, 0, `${e}\n \n${e}`);
      returnToLine(
        setTextMk,
        start,
        end,
        value,
        textArea,
        e.length + 1,
        e.length + 2,
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
    link = link.trim() ? link : `Ingresa_aqu??_tu_enlace_a_tu_${type}`;

    const start = textArea.current.selectionStart;
    const end = textArea.current.selectionEnd;
    let value = textArea.current.value.split("");

    if (start !== end) {
      value.splice(start, 0, `${initial}`);
      value.splice(end + 1, 0, `](${link})`);
      returnToLine(setTextMk, start, end, value, textArea, initial.length);
      return;
    }

    if (start == end) {
      value.splice(start, 0, `${initial}${description}](${link})`);
      returnToLine(
        setTextMk,
        start,
        end,
        value,
        textArea,
        initial.length,
        initial.length + description.length,
      );
    }
  };

  // secci??n de las funciones de funcionamiento del bot??n title y del bot??n options----------------------
  const actionTitles = {
    heading: ListType_TYPE_MAIN,
    uList: ListType_TYPE_MAIN,
    oList: ListType_TYPE_MAIN,
    bold: Locked_TYPE_MAIN,
    italic: Locked_TYPE_MAIN,
    citas: ListType_TYPE_MAIN,
    code: Locked_TYPE_MAIN,
    link: Links_TYPE_MAIN,
    img: Links_TYPE_MAIN,
  };
  const actionOptions = {
    heading: [
      ListType_TYPE_MAIN,

      ListType_TYPE_MAIN,
      ListType_TYPE_MAIN,
      ListType_TYPE_MAIN,
      ListType_TYPE_MAIN,
      ListType_TYPE_MAIN,
    ],
    uList: [ListType_TYPE_MAIN, ListType_TYPE_MAIN, ListType_TYPE_MAIN],
    oList: [ListType_TYPE_MAIN, ListType_TYPE_MAIN, ListType_TYPE_MAIN],
  };

  return (
    <>
      <div className="tools">
        {tools_mk.map((item, index) => (
          <BtnList
            key={item.id}
            type={"arrow"}
            title={`<img src="${item.link}" alt="imagen principal de ${item.name}" />`}
            titleFunctions={actionTitles[`${item.name}`]}
            options={item.data}
            optionsFunctions={actionOptions[`${item.name}`]}
            iteratorOptionsName={"html"}
            iteratorOptionsValue={"value"}
            propsTitle={item.value}
            propsOptions={item.data}
          />
        ))}
      </div>
    </>
  );
};

// elementos ejecutados al presionar alg??n bot??n

// c??digo para imprimir el texto en el area editable con el puntero en el lugar correcto
const returnToLine = (
  setTextMk,
  start,
  end,
  value,
  e,
  cantS,
  cantE,
  saveInfo,
) => {
  cantE = cantE ? cantE : cantS;
  saveInfo = saveInfo != undefined ? saveInfo : true;
  const type = e.target ? "target" : "current";

  if (typeof value == "object") {
    e[`${type}`].value = value.join(``);
  } else e[`${type}`].value = value;

  e[`${type}`].selectionStart = start + cantS;
  e[`${type}`].selectionEnd = end + cantE;

  e[`${type}`].focus();
  if (saveInfo) configTollsGlobals(e, setTextMk);
  e[`${type}`].focus();
};

//guarda todos los valores en la variable global historialArray para su uso en el comando
const configTollsGlobals = (e, setTextMk) => {
  const { array, count } = historial();

  let historialCount = count,
    historialArray = array;

  const type = e.target ? "target" : "current";

  if (historialCount < historialArray.length - 1) historialCount++;
  else {
    for (let i = 0; i < historialArray.length; i++) {
      historialArray[i] = historialArray[i + 1];
    }
  }

  //resetTimer(socket);
  //socket.emit("set text markdown", e[`${type}`].value);
  setTextMk(e[`${type}`].value);
  historialArray[historialCount] = e[`${type}`].value;
  localStorage.setItem("textMarkdown", e[`${type}`].value);
  localStorage.setItem("historialArray", JSON.stringify(historialArray));
  localStorage.setItem("historialCount", historialCount);
};
