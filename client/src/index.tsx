// import { App } from "./app";
import "./style.css";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./components/application/app";
import { Provider } from "react-redux";
import store from "./store/store";
import imageObj from "./utils/Image";
// ReactDOM.render()
const root = ReactDOM.createRoot(document.body);


  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );


// const app = new App(document.body);
