import { MarkdownView, App, Notice, TFile } from "obsidian";
import { Arguments, ExtendedBlockCache } from "./types";

export const insertButton = (app: App): void => {
  const button = `\`\`\`button
name
type
action
\`\`\``;
  const page = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = page.editor;
  editor.replaceSelection(button);
};

export const createArgumentObject = (source: string): Arguments =>
  source.split("\n").reduce((acc: Arguments, i: string) => {
    const split: string[] = i.split(" ");
    const key: string = split[0].toLowerCase();
    acc[key] = split.filter((item) => item !== split[0]).join(" ");
    return acc;
  }, {});

export const removeButton = async (
  app: App,
  remove: string,
  lineStart: number,
  lineEnd: number
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.cachedRead(file);
    const contentArray = content.split("\n");
    if (remove === "true") {
      const numberOfItems = lineEnd - lineStart;
      contentArray.splice(lineStart, numberOfItems + 1);
      if (contentArray[lineStart].includes("^button-")) {
        contentArray.splice(lineStart, 1);
      }
      content = contentArray.join("\n");
      await app.vault.modify(file, content);
    }
    if (remove.includes("[") && remove.includes("]")) {
      const args = remove.match(/\[(.*)\]/);
      if (args[1]) {
        const argArray = args[1].split(/,\s?/);
        const store = JSON.parse(localStorage.getItem("buttons"));
        const buttons = store.filter((item: ExtendedBlockCache) => {
          let exists;
          argArray.forEach((arg) => {
            if (item.id === `button-${arg}`) {
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
          content = contentArray.join("\n");
          await app.vault.modify(file, content);
        }
      }
    }
  } else {
    new Notice("There was a problem accessing the file", 1000);
  }
};

export const removeSection = async (
  app: App,
  section: string
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArr = content.split("\n");
    if (section.includes("[") && section.includes("]")) {
      const args = section.match(/\[(.*)\]/);
      if (args[1]) {
        const argArray = args[1].split(/,\s?/);
        if (argArray[0]) {
          const start = parseInt(argArray[0]) - 1;
          const end = parseInt(argArray[1]);
          const numLines = end - start;
          contentArr.splice(start, numLines);
          content = contentArr.join("\n");
        }
      }
    }
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
};

export const prependContent = async (
  app: App,
  insert: string,
  buttonName: string
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const buttonRegex = `\u0060{3}button\nname ${escapeRegExp(
      buttonName
    )}.*?\n\u0060{3}`;
    const re = new RegExp(buttonRegex, "gms");
    const button = originalContent.match(re)[0];
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0] ? splitContent[0] : ""}
${insert}
${button}${splitContent[1] ? splitContent[1] : ""}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue prepending content, please try again", 2000);
  }
};

export const appendContent = async (
  app: App,
  insert: string,
  buttonName: string
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const buttonRegex = `\u0060{3}button\nname ${escapeRegExp(
      buttonName
    )}.*?\n\u0060{3}`;
    const re = new RegExp(buttonRegex, "gms");
    const button = originalContent.match(re);
    const splitContent = originalContent.split(re);
    const content = `${
      splitContent[0] ? splitContent[0] : ""
    }${button}\n${insert}${splitContent[1] ? splitContent[1] : ""}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue appending content, please try again", 2000);
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

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
