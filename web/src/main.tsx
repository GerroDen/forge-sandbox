import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const elementById = document.getElementById("root");
if (!elementById) throw new Error("missing root element for app");
ReactDOM.createRoot(elementById).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
