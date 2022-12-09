import { Control } from "./common/control";
import { RegForm } from "./common/reg";

export class App extends Control<HTMLDivElement> {
  constructor(parent: HTMLElement) {
    super(parent, 'div', 'font-sans text-lg italic', '');


    const regForm = new RegForm(this.el);
  }
}