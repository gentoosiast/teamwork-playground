import { Control } from "./common/control";

export class App extends Control<HTMLDivElement> {
  constructor(parent: HTMLElement) {
    super(parent, 'div', 'main-container', '');
  }
}