import { App, Notice } from "obsidian";
import { appendContent, templater } from "../../utils";
import { ButtonCache } from "../../types";

const templateButton = (
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

  if (type.includes("append")) {
    return async () => {
      const content = await app.vault.read(file);
      const runTemplater = await templater(app, file);
      const processed = await runTemplater(content);
      appendContent(app, button, processed);
    };
  }
};

export default templateButton;
