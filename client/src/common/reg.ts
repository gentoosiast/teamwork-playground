import {Control} from "./control";


class Button extends Element {
  constructor (parent, className, onClick) {
      super(parent, 'button', className, content);
      this.elem.onclick = onClick;
  }
}


class RegForm extends Control<HTMLInputElement> {
  constructor(parent: HTMLElement, tag: HTMLFormElement, className: string = '') {
    super(parent, tag, className);

    const nameForm = new Control(this.elem, 'name');
    const ageForm = new Control(this.elem, 'age');

    const btn = new Button(this.elem, 'button')

  }
}