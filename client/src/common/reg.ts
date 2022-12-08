import {Control} from "./control";


// class Button extends Control<HTMLButtonElement> {
//   constructor (parent: HTMLElement, className: string, content: string, onClick?: ()=>void) {
//       super(parent, 'button', className, content);
//       this.el.onclick = onClick;
//   }
// }


export class RegForm extends Control<HTMLFormElement> {
  constructor(parent: HTMLElement) {
    super(parent, 'form', 'reg-form', '');

    const fieldSet = new Control<HTMLFieldSetElement>(this.el, "fieldset", 'fieldset');

    const email = new Control<HTMLInputElement>(fieldSet.el, "input", 'input-email');
    email.el.type = 'email';
    email.el.name = 'email';
    email.el.id = 'email';
    email.el.required = true;
    const labelEmail = new Control<HTMLLabelElement>(fieldSet.el, 'label', 'input-label', 'Your email');
    labelEmail.el.htmlFor = 'email';

    const age = new Control<HTMLInputElement>(fieldSet.el, "input", 'input-age');
    age.el.type = 'number';
    age.el.name = 'age';
    age.el.id = 'age';
    const labelage = new Control<HTMLLabelElement>(fieldSet.el, 'label', 'input-label', 'Your age');
    labelage.el.htmlFor = 'age';

    const btn = new Control<HTMLInputElement>(fieldSet.el, "input", 'form-btn', 'Submit');
    btn.el.type = 'submit';
    this.el.action = '//localhost:3000'
    this.el.enctype = 'application/x-www-form-urlencoded'
    this.el.method = 'GET';
  }
}