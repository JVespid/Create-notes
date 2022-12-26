import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./../sass/globals.scss";

import GlobalState from "./../context/global/globalState";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <GlobalState>
    <App />
  </GlobalState>
  </React.StrictMode>
);
