import React from "react";
import "../../sass/main.scss";

/**
 * La función Main es un componente de React que establece el estado visible en verdadero cuando se
 * monta el componente.
 * @returns Se está devolviendo el componente principal.
 * @param {Function} setVisible Función que establece el estado visible en verdadero.
 */
const Main = ({ setVisible }) => {
  React.useEffect(() => {
    setVisible(true);
  }, []);
  return (
    <>
      <MainComponent />
    </>
  );
};

export default Main;
// subcomponentes  de la pagina main

/**
 * Esta función devuelve un fragmento de React que contiene un encabezado y un elemento principal.
 * @returns La declaración de devolución devuelve un elemento React.
 */
const MainComponent = () => {
  return (
    <>
      <header className="header-main">
        
      </header>
      <main className="main-main"></main>
    </>
  );
};
