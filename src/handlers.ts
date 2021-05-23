import { MarkdownView, App, Notice, TFile } from "obsidian";
import { ExtendedBlockCache } from "./types";
import { getStore } from "./buttonStore";
import { createContentArray, handleValueArray } from "./utils";

export const removeButton = async (
  app: App,
  remove: string,
  lineStart: number,
  lineEnd: number
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  const store = getStore(app.isMobile);
  if (remove === "true") {
    const numberOfItems = lineEnd - lineStart;
    contentArray.splice(lineStart, numberOfItems + 1);
    if (
      contentArray[lineStart] &&
      contentArray[lineStart].includes("^button-")
    ) {
      contentArray.splice(lineStart, 1);
    }
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
  }
  if (lineStart === lineEnd) {
    contentArray.splice(lineStart, 1);
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    handleValueArray(remove, async (argArray) => {
      const buttons =
        store &&
        store.filter((item: ExtendedBlockCache) => {
          let exists;
          argArray.forEach((arg) => {
            if (item.id === `button-${arg}` && item.path === file.path) {
              exists = true;
            }
          });
          return exists;
        });
      if (buttons[0]) {
        let offset = 0;
        buttons.forEach((button: ExtendedBlockCache) => {
          const start = button.position.start.line - offset;
          const numLines =
            button.position.end.line - button.position.start.line;
          contentArray.splice(start, numLines + 2);
          offset += numLines + 2;
        });
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    });
  }
};

export const removeSection = async (
  app: App,
  section: string
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  if (section.includes("[") && section.includes("]")) {
    const args = section.match(/\[(.*)\]/);
    if (args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        const start = parseInt(argArray[0]) - 1;
        const end = parseInt(argArray[1]);
        const numLines = end - start;
        contentArray.splice(start, numLines);
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    }
  }
};

export const prependContent = async (
  app: App,
  insert: string,
  lineStart: number
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    contentArray.splice(lineStart, 0, insert);
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue prepending content, please try again", 2000);
  }
};

export const appendContent = async (
  app: App,
  insert: string,
  lineEnd: number
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    let insertionPoint;
    if (
      contentArray[lineEnd + 1] &&
      contentArray[lineEnd + 1].includes("^button")
    ) {
      insertionPoint = lineEnd + 2;
      insert = `\n${insert}`;
    } else {
      insertionPoint = lineEnd + 1;
    }
    contentArray.splice(insertionPoint, 0, `${insert}`);
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue appending content, please try again", 2000);
  }
};

export const addContentAtLine = async (
  app: App,
  insert: string,
  type: string
): Promise<void> => {
  const lineNumber = type.match(/(\d+)/g);
  if (lineNumber[0]) {
    const insertionPoint = parseInt(lineNumber[0]) - 1;
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const file = activeView.file;
      let content = await app.vault.read(file);
      const contentArray = content.split("\n");
      contentArray.splice(insertionPoint, 0, `${insert}`);
      content = contentArray.join("\n");
      await app.vault.modify(file, content);
    }
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
};

export const createNote = async (
  app: App,
  content: string,
  type: string
): Promise<void> => {
  const path = type.match(/\(([\s\S]*?),?\s?(split)?\)/);
  if (path) {
    try {
      await app.vault.create(`${path[1]}.md`, content);
      const file = app.vault.getAbstractFileByPath(`${path[1]}.md`) as TFile;
      if (path[2]) {
        await app.workspace.splitActiveLeaf().openFile(file);
      } else {
        app.workspace.activeLeaf.openFile(file);
      }
    } catch (e) {
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
};
