import {Control} from "./control";


// class Button extends Control<HTMLButtonElement> {
//   constructor (parent: HTMLElement, className: string, content: string, onClick?: ()=>void) {
//       super(parent, 'button', className, content);
//       this.el.onclick = onClick;
//   }
// }


export class RegForm extends Control<HTMLFormElement> {
  constructor(parent: HTMLElement) {
    super(parent, 'form', 'p-10 bg-yellow-100 w-1/4 drop-shadow-md m-auto', '');

    const fieldSet = new Control<HTMLFieldSetElement>(this.el, "fieldset", 'flex flex-col');

    const email = new Control<HTMLInputElement>(fieldSet.el, "input", 'border-2 rounded-md border-emerald-400 outline-0');
    email.el.type = 'email';
    email.el.name = 'email';
    email.el.id = 'email';
    email.el.required = true;
    const labelEmail = new Control<HTMLLabelElement>(fieldSet.el, 'label', 'pb-5', 'Your email');
    labelEmail.el.htmlFor = 'email';

    const age = new Control<HTMLInputElement>(fieldSet.el, "input", 'border-2 rounded-md border-emerald-400 outline-0');
    age.el.type = 'number';
    age.el.name = 'age';
    age.el.id = 'age';
    const labelage = new Control<HTMLLabelElement>(fieldSet.el, 'label', 'pb-5', 'Your age');
    labelage.el.htmlFor = 'age';

    const btn = new Control<HTMLInputElement>(fieldSet.el, "input", 'p-2 text-zinc-50 border-2 rounded-md bg-emerald-400 hover:bg-emerald-600 focus:bg-emerald-600', 'Submit');
    btn.el.type = 'submit';
    this.el.action = '//localhost:3000';
    this.el.enctype = 'application/x-www-form-urlencoded';
    this.el.method = 'GET';
  }
}