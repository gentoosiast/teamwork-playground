import { Control } from "./control";

class Button extends Control<HTMLButtonElement> {
  constructor(parent: HTMLElement, className: string, onClick?: () => void) {
    super(parent, "button", className);
    // this.el.onclick = onClick;
  }
}

class RegForm extends Control<HTMLInputElement> {
  constructor(parent: HTMLElement, className: string = "") {
    super(parent, "input", className);

    const nameForm = new Control(this.el, "name");
    const ageForm = new Control(this.el, "age");

    const btn = new Button(this.el, "btn");
  }
}
