export class Control<T extends keyof HTMLElementTagNameMap>{
  el: HTMLElementTagNameMap[T];
  constructor(parent: HTMLElement, tag: T, className: string = '', content: string = '') {
    this.el = document.createElement(tag);
    this.el.className = className;
    this.el.textContent = content;
    if (parent) {
      parent.append(this.el);
    }
  }

  destroy() {
    this.el.remove();
  }
}