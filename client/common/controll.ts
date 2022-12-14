
class Control<NodeType extends HTMLElement = HTMLElement>{
    setCanvasBackground(bgImageIndex: string) {
        throw new Error("Method not implemented.");
    }
    public node: NodeType;

    constructor(parentNode: HTMLElement | null, tagName = 'div', className = '', content = '') {
        const el = document.createElement(tagName);
        el.className = className;
        el.textContent = content;
        if (parentNode) {
            parentNode.append(el);
        }
        this.node = el as NodeType;
    }

    destroy(): void {
        this.node.remove();
    }

}

export default Control;
