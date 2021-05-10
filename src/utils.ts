import { MarkdownView, App, Notice, TFile } from "obsidian";
import { Arguments, Position } from "./types";

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

export const createContentArray = async (
  app: App
): Promise<{ contentArray: string[]; file: TFile }> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const content = await app.vault.read(file);
    return { contentArray: content.split("\n"), file };
  }
  new Notice("Could not get Active View", 1000);
  console.error("could not get active view");
};

export const handleValueArray = (
  value: string,
  callback: (argArray: string[]) => void
): void => {
  if (value.includes("[") && value.includes("]")) {
    const args = value.match(/\[(.*)\]/);
    if (args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        callback(argArray);
      }
    }
  }
};

export function getNewArgs(
  app: App,
  position: Position,
  originalButton: string
): Promise<{ args: Arguments; content: string }> {
  const promise = new Promise((resolve) => {
    setTimeout(async () => {
      const activeView = app.workspace.getActiveViewOfType(MarkdownView);
      const length = position.lineEnd - position.lineStart;
      const newContent = await app.vault
        .read(activeView.file)
        .then((content: string) => content.split("\n"));
      const newButton = newContent
        .splice(position.lineStart, position.lineEnd)
        .join("\n")
        .replace("```button", "")
        .replace("```", "");
      newContent.splice(position.lineStart, length, originalButton);
      const content = newContent.join("\n");
      resolve({ args: createArgumentObject(newButton), content });
    }, 250);
  });
  return promise as Promise<{ args: Arguments; content: string }>;
}

export const wrapAround = (value: number, size: number): number => {
  return ((value % size) + size) % size;
};
