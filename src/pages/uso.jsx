import React from "react";
import BtnList from "../../components/notes/btnList";
import {marked} from "marked";
const Uso = () => {
  function sas() {
    console.log("hola");
  }
  const options = [
    "<h1>Heading</h1>",
    "nombre",
    "<img src='https://jvespid.github.io/apis/todoList/img/svg/heading.svg' alt='' /> ",
    `
  <ul>
    <li>Lista no ordenada</li>
    </ul></ul>`,
  ];
  const optionsFunctions = [sas, sas, sas, sas];

  return (
    <>

    </>
  );
};

export default Uso;
