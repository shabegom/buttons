import { Fragment, h } from "preact";
import { StateUpdater } from "preact/hooks";
import {
  commandButton,
  IDSection,
  linkButton,
  RemoveSection,
  ReplaceSection,
  SwapSection,
  TemplateButton,
} from "./sections";
import { ButtonProps } from "../buttonMaker";

export interface Page {
  input?: (
    type: string,
    value: string | number | boolean,
    options?: string[],
    handler?: (e: Event) => void
  ) => h.JSX.Element;
  setPage?: StateUpdater<number>;
  button?: ButtonProps;
  setButton?: StateUpdater<ButtonProps>;
}

export const pageOne = ({ input, setPage, button }: Page) => {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          width: "95%",
          justifyContent: "space-between",
        }}
      >
        <p>
          Welcome to the Button Maker! This will help you create a button
          codeblock. If you ever feel confused, you can check the documentation.
        </p>
        <p>Give your button a name</p>
        {input("input", "name")}
        <p>Choose a button typ:e</p>
        <ul style={{ marginTop: "-10px" }}>
          <li>Command: execute a command from the command palette</li>
          <li>Link: open a url or x-callback</li>
          <li>Template: run a Templater template</li>
        </ul>
        {input("select", "type", [
          "type of button",
          "command",
          "link",
          "template",
        ])}
        <div
          style={{
            padding: "5px",
            margin: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            disabled={!button.type}
            type="button"
            style={buttonStyles}
            value="Next"
            onClick={() => setPage(1)}
          />
        </div>
      </div>
    </Fragment>
  );
};

export const pageTwo = ({ setPage, button, setButton, input }: Page) => {
  const type = button.type as string;
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "95%",
          padding: "10px",
        }}
      >
        {type === "command" && commandButton({ button, setButton })}
        {type === "link" && linkButton({ input })}
        {type.includes("template") &&
          TemplateButton({ input, button, setButton })}
        <div
          style={{
            padding: "5px",
            margin: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            type="button"
            style={buttonStyles}
            value="Previous"
            onClick={() => setPage(0)}
          />
          <input
            disabled={!button.action}
            type="button"
            style={buttonStyles}
            value="Next"
            onClick={() => setPage(2)}
          />
        </div>
      </div>
    </Fragment>
  );
};

export const pageThree = ({ setPage, button, input }: Page) => {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "95%",
          padding: "10px",
        }}
      >
        <p>Mutations: do you need to perform additional actions?</p>
        <ul style={{ marginTop: "-10px" }}>
          <li>Remove: remove this or other buttons when clicked</li>
          <li>Replace: replace a section of the note</li>
          <li>Swap: use this button to run multiple actions in sequence</li>
        </ul>
        {button.showRemove &&
          "add button ids that you want to remove. Example: id1,id2,id3"}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>remove &nbsp;</span>
          {input("checkbox", "showRemove")}
          {button.showRemove && RemoveSection({ input })}
        </div>
        {button.showReplace &&
          "add the start and end lines to replace. Example: 1,3"}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>replace &nbsp;</span>
          {input("checkbox", "showReplace")}
          {button.showReplace && ReplaceSection({ input })}
        </div>
        {button.showSwap &&
          "add the button ids of the buttons whose actions you'd like to run. Example: id1,id2,id3"}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>swap &nbsp;</span>
          {input("checkbox", "showSwap")}
          {button.showSwap && SwapSection({ input })}
        </div>
        <br />
        {
          "you can provide a custom button ID. If you don't, one will be generated."
        }
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>button ID &nbsp;</span>
          {IDSection({ input })}
        </div>
        <div
          style={{
            padding: "5px",
            margin: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            type="button"
            style={buttonStyles}
            value="Previous"
            onClick={() => setPage(1)}
          />
        </div>
      </div>
    </Fragment>
  );
};

const buttonStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-normal)",
  backgroundColor: "var(--interactive-normal)",
  fontSize: "var(--font-ui-small)",
  borderRadius: "var(--input-radius)",
  border: 0,
  padding: "var(--size-4-1) var(--size-4-3)",
  height: "var(--input-height)",
  cursor: "var(--cursor)",
  fontFamily: "inherit",
  outline: "none",
  userSelect: "none",
  whiteSpace: "nowrap",
  boxShadow: "var(--input-shadow)",
};
