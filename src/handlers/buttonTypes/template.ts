import { App, Notice, TFile } from "obsidian";
import {
  appendContent,
  createNote,
  insertContent,
  prependContent,
  templater,
} from "../../utils";
import { ButtonCache } from "../../types";

// TODO: remove app from all function argsd
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
  processTemplate(app, file).then((processed) => {
    if (type.includes("append")) {
      appendContent(app, button, processed);
    }
    if (type.includes("prepend")) {
      prependContent(app, button, processed);
    }
    if (type.includes("line")) {
      insertContent(app, button, processed);
    }
    if (type.includes("note")) {
      createNote(app, button, processed);
    }
  });
};

async function processTemplate(app: App, file: TFile) {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(file);
    const processed = await runTemplater(content);
    return processed;
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

export default templateButton;
