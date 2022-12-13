// import { App } from "./app";
import "./style.css";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./components/application/app";

// ReactDOM.render()
const root = ReactDOM.createRoot(document.body);
root.render(
  App()
);

// const app = new App(document.body);
