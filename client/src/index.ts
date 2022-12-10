// import { App } from "./app";
import "./style.css";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./reactapp";

// ReactDOM.render()
const root = ReactDOM.createRoot(document.body);
root.render(
  App({
    onClick: () => {
      console.log("test of func");
    },
    text: "someText",
  })
);

// const app = new App(document.body);
