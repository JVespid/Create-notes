import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
import Main from "./pages/main";
import Notes from "./pages/notes";
import Session from "./pages/session";
import "./../sass/routes.scss";

import { globalContext } from "./../context/global/context";

function App({ socket }) {
  const [visible, setVisible] = React.useState(true);
  const { pageMain } = React.useContext(globalContext);
  const { pages } = pageMain;

  const navVisible = {
    display: visible ? "inline-block" : "none",
  };
  function connectSocket() {
    console.log("hola");
    //socket.emit("onConnect", "conectado");
  }

  return (
    <>
      <BrowserRouter>
        <nav className="routes" style={navVisible}>
          <ul className="routes-ul">
            {pages
              ? pages.map(page => (
                  <li className="routes-li" key={page.id}>
                    <Link to={page.href}>
                      <p>{page.name}</p>
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </nav>

        <Routes>
          <Route exact path={"/"} element={<Main setVisible={setVisible} />} />
          <Route
            exact
            path="/Notes"
            element={<Notes setVisible={setVisible} socket={socket} />}
          />
          <Route
            exact
            path="/Session"
            element={<Session setVisible={setVisible} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
