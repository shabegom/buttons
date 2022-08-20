import { ButtonComponent } from "obsidian";

const button = (
  el: HTMLElement,
  name: string,
  handler: () => void,
  className: string,
  color: string
): ButtonComponent => {
  const button = new ButtonComponent(el);
  button.setClass(
    `${className ? className : "button-default"} ${color ? color : ""}`
  );
  button.setButtonText(name);
  button.onClick(handler);
  return button;
};

export default button;
