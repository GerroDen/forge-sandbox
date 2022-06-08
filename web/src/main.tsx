import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const elementById = document.getElementById("root");
if (!elementById) throw new Error("missing root element for app");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  elementById
);
