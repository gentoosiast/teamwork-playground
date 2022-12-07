export class Control<T extends HTMLElement> {
  el: T;
  constructor(
    parent: HTMLElement,
    tag: string = "div",
    className: string = "",
    content: string = ""
  ) {
    this.el = document.createElement(tag) as T;
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
