import { ButtonComponent } from "obsidian";

const button = (el: HTMLElement): ButtonComponent => {
  const button = new  ButtonComponent(el);
  button.setButtonText("Click me!");
  button.onClick(() => {
    console.log("Button clicked!");
  });
  return button;
};

export default button;
