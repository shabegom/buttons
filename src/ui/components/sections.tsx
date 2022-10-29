import { Fragment, h } from "preact";
import { CommandSelect, TemplateSelect } from "./select";
import { Page } from "./pages";
import { useState } from "preact/hooks";

export const commandButton = ({ button, setButton }: Page) => {
  return (
    <Fragment>
      <p>Choose a command</p>
      <CommandSelect button={button} setButton={setButton} />
    </Fragment>
  );
};

export const linkButton = ({ input }: Page) => {
  return (
    <Fragment>
      <p>Enter a url</p>
      {input("input", "action")}
    </Fragment>
  );
};

export const TemplateButton = ({ input, button, setButton }: Page) => {
  const setInsertionType = (e: Event) => {
    let selectValue = (e.target as HTMLInputElement).value;
    if (selectValue === "create") {
      selectValue = "note";
    }
    const command = `${selectValue} template`;
    setButton({ ...button, type: command });
  };
  const type = button.type as string;
  return (
    <Fragment>
      <p>Do you want to append, prepernd, insert or create a new note?</p>
      <ul>
        <li>Append: add the template contents below the button</li>
        <li>Prepend: add the template contents above the button</li>
        <li>
          Insert: add the template contents at a specified line in the note
        </li>
        <li>Create: create a new note with the template contents</li>
      </ul>
      {input(
        "select",
        "command",
        ["choose an insertion method", "append", "prepend", "line", "create"],
        setInsertionType
      )}
      {type.includes("insert") && InsertTemplate({ input, button, setButton })}
      {type.includes("note") && NoteTemplate({ input, button, setButton })}
      <p>Choose a template</p>
      <TemplateSelect button={button} setButton={setButton} />
    </Fragment>
  );
};

const InsertTemplate = ({ input, button, setButton }: Page) => {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(100);

  const setInsertLineNumbers = (type: string) => (e: Event) => {
    const insertValue = (e.target as HTMLInputElement).value;
    if (type === "start") {
      const startInt = parseInt(insertValue, 10);
      if (!isNaN(startInt)) {
        setStart(startInt);
        setButton({ ...button, type: `line(${startInt},${end}) template` });
      }
      if (isNaN(start)) {
        setStart(1);
        setButton({ ...button, type: `line() template` });
      }
    }
    if (type === "end") {
      const endInt = parseInt(insertValue, 10);
      if (!isNaN(endInt)) {
        setEnd(endInt);
        setButton({
          ...button,
          type: `line(${start},${endInt}) template`,
        });
      }
      if (isNaN(end)) {
        setEnd(100);
        setButton({
          ...button,
          type: `line(${start}) template`,
        });
      }
    }
  };

  return (
    <Fragment>
      <p>Step 3.5: Set the starting and ending line numbers for insertion</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>start:&nbsp;</span>
        {input("input", start, [], setInsertLineNumbers("start"))}
        <span>end:&nbsp;</span>
        {input("input", end, [], setInsertLineNumbers("end"))}
      </div>
    </Fragment>
  );
};

const NoteTemplate = ({ input, button, setButton }: Page) => {
  const [open, setOpen] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const setNote = (value: string) => (e: Event) => {
    if (value === "title") {
      const title = (e.target as HTMLInputElement).value;
      setNoteTitle(title);
      if (open === "") {
        setButton({ ...button, type: `note(${title}) template` });
      }
      if (open !== "") {
        setButton({ ...button, type: `note(${title},${open}) template` });
      }
    }
    if (value === "open") {
      let openValue;
      switch ((e.target as HTMLInputElement).value) {
        case "Same Window":
          setOpen("same");
          openValue = "same";
          break;
        case "Vertical Split":
          setOpen("vsplit");
          openValue = "vsplit";
          break;
        case "Horizontal Split":
          setOpen("hsplit");
          openValue = "hsplit";
          break;
        case "New Tab":
          setOpen("tab");
          openValue = "tab";
          break;
        case "New Window":
          setOpen("window");
          openValue = "window";
          break;
        case "Don't Open":
          setOpen("false");
          openValue = "false";
          break;
      }
      if (open === "") {
        setButton({ ...button, type: `note(${noteTitle}) template` });
      }
      if (openValue !== "") {
        setButton({
          ...button,
          type: `note(${noteTitle}, ${openValue}) template`,
        });
      }
    }
  };

  return (
    <Fragment>
      <p>Step 3.5: Set the note title</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p>
          <span>Title of note: &nbsp;</span>
          {input("input", noteTitle, [], setNote("title"))}
        </p>
        <p>
          <span>Where should the note open?: &nbsp;</span>
          {input(
            "select",
            open,
            [
              "open created note in",
              "Vertical Split",
              "Horizontal Split",
              "New Tab",
              "Same Window",
              "New Window",
              "Don't Open",
            ],
            setNote("open")
          )}
        </p>
      </div>
    </Fragment>
  );
};

export const RemoveSection = ({ input }: Page) => {
  return <Fragment>{input("input", "remove")}</Fragment>;
};
export const ReplaceSection = ({ input }: Page) => {
  return <Fragment>{input("input", "replace")}</Fragment>;
};
export const SwapSection = ({ input }: Page) => {
  return <Fragment>{input("input", "swap")}</Fragment>;
};

export const IDSection = ({ input }: Page) => {
  return <Fragment>{input("input", "id")}</Fragment>;
};
