import { Notice } from "obsidian";
import {
  appendContent,
  createNote,
  insertContent,
  prependContent,
} from "../../utils";
import { ButtonCache } from "../../types";

const templateButton = (button: ButtonCache): (() => void) => {
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
      appendContent(button, file);
    };
  }
  if (type.includes("prepend")) {
    return () => prependContent(button, file);
  }
  if (type.includes("line")) {
    return () => insertContent(button, file);
  }
  if (type.includes("note")) {
    return () => createNote(app, button, file);
  }
};

export default templateButton;
