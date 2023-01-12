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


const base=50
const changes =[50,100,150,200]

const imagesObjects=()=>{
  return new Promise((resB,rej)=>{
    const allVertical=Promise.all(changes.map(c=>imageObj('./public/assets/ship.png',base,c)))

    allVertical.then(d=>{
      const allHorizont=Promise.all(changes.map(c=>imageObj('./public/assets/ship.png',c,base)))
      allHorizont.then(h=>resB({vert:d,hor:h}))
    })
  })
}
// const imgs=imagesObjects()
// imgs.then(d=>{
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
// })



// const app = new App(document.body);
