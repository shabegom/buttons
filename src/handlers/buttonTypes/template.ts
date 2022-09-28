import Buttons from "../../main";
import { Notice } from "obsidian";
import {
  appendContent,
  createNote,
  insertContent,
  prependContent,
} from "../../utils";
import { ButtonCache } from "../../types";

const templateButton = (plugin: Buttons, button: ButtonCache): (() => void) => {
  const { action, type } = button.args;
  const templaterExists = app.plugins.plugins["templater-obsidian"];

  if (!templaterExists) {
    new Notice(
      "You need to enable the templates plugin or install Templater to use this feature."
    );
    return;
  }
  const templateFile = action.toLowerCase();
  const files = app.vault.getFiles();
  const file = files.find(
    (file) => file.basename.toLowerCase() === templateFile
  );
  if (!file) {
    new Notice(`Could not find ${action} template`);
    return;
  }
  if (type.includes("append")) {
    return () => {
      console.time("append");
      appendContent(button, file);
      plugin.noteChanged = new Date().getTime();
      console.timeEnd("append");
    };
  }
  if (type.includes("prepend")) {
    return () => {
      prependContent(button, file);
      plugin.noteChanged = new Date().getTime();
    };
  }
  if (type.includes("line")) {
    return () => {
      insertContent(button, file);
      plugin.noteChanged = new Date().getTime();
    };
  }
  if (type.includes("note")) {
    return () => {
      createNote(button, file);
      plugin.noteChanged = new Date().getTime();
    };
  }
};

export default templateButton;
