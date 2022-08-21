import { MarkdownRenderChild } from "obsidian";
import { button } from "./";

class InlineButton extends MarkdownRenderChild {
  constructor(
    public el: HTMLElement,
    public name: string,
    public onClick: () => void,
    public className: string,
    public color: string
  ) {
    super(el);
  }
  onload() {
    const span = document.createElement("span");
    button(span, this.name, this.onClick, this.className, this.color);
    this.el.replaceWith(span);
  }
}

export default InlineButton;
