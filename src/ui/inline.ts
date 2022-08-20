import { MarkdownRenderChild } from "obsidian";
import { button } from "./";

class InlineButton extends MarkdownRenderChild {
  constructor(
    public el: HTMLElement,
    public className: string,
    public color: string,
    public onClick: () => void,
    public name: string
  ) {
    super(el);
  }
  onload() {
    const span = document.createElement("span");
    button(span, this.name, this.onClick, className);
    this.el.replaceWith(span);
  }
}

export default InlineButton;
