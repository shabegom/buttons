import { App, Notice, TFile } from "obsidian";
import { ButtonCache } from "../types";
import { processTemplate } from "./";

// TODO: test createNote actually works
async function createNote(app: App, button: ButtonCache, templateFile: TFile) {
  const { args } = button;
  const { type } = args;
  const regex = type.match(
    /\(([\s\S]*?),?\s?(vsplit|hsplit|window|tab|same|false)?\)/
  );
  if (regex) {
    const [, path, openIn] = regex;
    console.log(path);
    console.log(openIn);
    try {
      const content = await processTemplate(templateFile);
      await app.vault.create(`${path}.md`, content);
      const file = app.vault.getAbstractFileByPath(`${path}.md`) as TFile;
      switch (openIn) {
        case "vsplit":
          await app.workspace.getLeaf("split", "vertical").openFile(file);
          break;
        case "hsplit":
          await app.workspace.getLeaf("split", "horizontal").openFile(file);
          break;
        case "window":
          await app.workspace.getLeaf("window").openFile(file);
          break;
        case "tab":
          await app.workspace.getLeaf(true).openFile(file);
          break;
        case "same":
          app.workspace.getLeaf().openFile(file);
          break;
        case "false":
          break;
      }
    } catch (e) {
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
}

export { createNote };
