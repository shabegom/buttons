import { App, Notice, SplitDirection, TFile } from "obsidian";
import { ButtonCache } from "../types";

// TODO: test createNote actually works
async function createNote(app: App, button: ButtonCache, content: string) {
  const { args } = button;
  const { type } = args;
  const regex = type.match(
    /\(([\s\S]*?),?\s?(split\((vertical|horizontal)\))?\)/
  );
  if (regex) {
    const [, path, doSplit, split] = regex;
    try {
      await app.vault.create(`${path}.md`, content);
      const file = app.vault.getAbstractFileByPath(`${path}.md`) as TFile;
      if (doSplit) {
        await app.workspace
          .getLeaf(true, split as SplitDirection)
          .openFile(file);
      } else {
        app.workspace.getLeaf().openFile(file);
      }
    } catch (e) {
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
}

export { createNote };
