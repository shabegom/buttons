import { ButtonComponent } from "obsidian";

const button = (el: HTMLElement, name: string, handler: () => void): ButtonComponent => {
  const button = new  ButtonComponent(el);
  button.setClass("button-default");
  button.setButtonText(name);
  button.onClick(handler);
  return button;
};

export default button;
