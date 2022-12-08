import {Control} from "./control";


class Button extends Control<HTMLButtonElement> {
  constructor (parent: HTMLElement, className: string, content: string, onClick?: ()=>void) {
      super(parent, 'button', className, content);
      this.el.onclick = onClick;
  }
}


export class RegForm extends Control<HTMLInputElement> {
  constructor(parent: HTMLElement) {
    super(parent, 'div', 'reg-form', '');

    const email = new Control<HTMLInputElement>(this.el, "input", 'input-email');
    email.el.type = 'email';
    email.el.name = 'email';
    const labelEmail = new Control<HTMLLabelElement>(this.el, 'label', 'input-label', 'Your email');
    labelEmail.el.htmlFor = 'email';

    const age = new Control<HTMLInputElement>(this.el, "input", 'input-age');
    age.el.type = 'number';
    age.el.name = 'age';
    const labelage = new Control<HTMLLabelElement>(this.el, 'label', 'input-label', 'Your age');
    labelage.el.htmlFor = 'age';

    const btn = new Button(this.el, 'form-btn', 'Submit')

  }
}