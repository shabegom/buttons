import { App, Notice } from "obsidian";
import { appendContent, templater } from "../../utils";
import { ButtonCache } from "../../types";

const templateButton = async (
  action: string,
  type: string,
  app: App,
  button: ButtonCache
): (() => void) => {
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
  const content = await app.vault.read(file);
  const runTemplater = await templater(app, file);
  const processed = await runTemplater(content);

  if (type.includes("append")) {
    appendContent(app, button, processed);
  }
  if (type.includes("prepned")) {
    // TODO: write prependContent function
    // prependContent(app, button, processed);
  }
  if (type.includes("line")) {
    // TODO: write lineContent function
    // lineContent(app, button, processed);
  }
  if (type.includes("note")) {
    // TODO: write noteContent function
    // noteContent(app, button, processed);
  }
};

export default templateButton;
