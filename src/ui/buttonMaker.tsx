import { Modal, Notice } from "obsidian";
import { Fragment, h, render } from "preact";
import { useState } from "preact/hooks";
import { makeInput } from "./components/input";
import { pageOne, pageThree, pageTwo } from "./components/pages";
import { nanoid } from "src/utils";

export default class ButtonMaker extends Modal {
  onOpen() {
    const { titleEl, contentEl } = this;
    titleEl.innerText = "Button Maker";
    render(<ButtonMakerUI modal={this} />, contentEl);
  }
}

export type ButtonProps = {
  name?: string;
  type?: string | undefined;
  action?: string | undefined;
  remove?: string | undefined;
  showRemove?: boolean;
  replace?: string | undefined;
  showReplace?: boolean;
  swap?: string | undefined;
  showSwap?: boolean;
  id?: string | undefined;
};

function ButtonMakerUI({ modal }: { modal: Modal }): h.JSX.Element {
  const [button, setButton] = useState({
    name: "",
    type: undefined,
    action: undefined,
    remove: undefined,
    replace: undefined,
    swap: undefined,
    id: undefined,
  });
  const [page, setPage] = useState(0);
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!button.id) {
      button.id = nanoid(6);
    }
    const output = [];
    output.push(`\`\`\`button`);
    button.name && output.push(`name ${button.name}`);
    button.type && output.push(`type ${button.type}`);
    button.action && output.push(`action ${button.action}`);
    button.remove && output.push(`remove ${button.remove}`);
    button.replace && output.push(`replace ${button.replace}`);
    button.swap && output.push(`swap ${button.swap}`);
    output.push(`\`\`\``);
    output.push(`^button-${button.id}`);
    window.navigator.clipboard.writeText(output.join("\n"));
    new Notice("Button copied to clipboard!");
    modal.close();
  };
  const input = makeInput(button, setButton);
  return (
    <Fragment>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {page === 0 && pageOne({ input, setPage, button })}
          {page === 1 && pageTwo({ setPage, button, setButton, input })}
          {page === 2 && pageThree({ setPage, button, setButton, input })}
          <button type="submit">Create Button</button>
        </div>
      </form>
      <div>
        <code style={{ lineHeight: 0.2 }}>
          <p>```button</p>
          <p>name {button.name}</p>
          <p>type {button.type}</p>
          <p>action {button.action}</p>
          {button.remove && <p>remove [{button.remove}]</p>}
          {button.replace && <p>replace [{button.replace}]</p>}
          {button.swap && <p>swap [{button.swap}]</p>}
          {button.id && <p>button-${button.id}</p>}
          <p>```</p>
        </code>
      </div>
    </Fragment>
  );
}
