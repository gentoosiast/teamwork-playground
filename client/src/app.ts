import { Control } from "./common/control";

export class App extends Control<'div'> {
  constructor(parent: HTMLElement) {
    super(parent, 'div', '', '');
  }
}