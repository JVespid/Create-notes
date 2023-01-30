import React from "react";
import "../../sass/toolHtml.scss";
import BtnList from "./btnList";

const ToolHtml = ({ refSelect, changeStyle, socket }) => {
  // sistema de prueba
  const prueba = () => {
    console.log("prueba");
  };
  const options_content = ["Cambiar id", "¿Para que sirve el id?", "Descargar"];
  const options_Function = [prueba, prueba, prueba];

  return (
    <>
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

        <div className="content-burger-tool-html">
          <BtnList
            type={"burger"}
            options={options_content}
            optionsFunctions={options_Function}
          />
        </div>
      </div>
    </>
  );
};

export default ToolHtml;
