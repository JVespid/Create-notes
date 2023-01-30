import React from "react";
import BtnList from "../../components/notes/btnList";
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
      <BtnList
        type={"burger"}
        title={"<img src='https://jvespid.github.io/apis/todoList/img/svg/list.svg' alt='' />"}
        titleFunctions={sas}
        options={options}
        
        optionsFunctions={optionsFunctions}
        key={1}
      />
      
      <BtnList
        type={"burger"}
        title={"wa ha ha ha"}
        titleFunctions={sas}
        options={options}
        optionsFunctions={optionsFunctions}
        key={2}
      />
      <BtnList
        type={"arrow"}
        title={"hola"}
        titleFunctions={sas}
        options={options}
        optionsFunctions={optionsFunctions}
        key={3}
      />
    </>
  );
};

export default Uso;
