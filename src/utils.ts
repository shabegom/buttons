import { MarkdownView, App, Notice, TFile } from "obsidian";
import { Arguments } from "./types";

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
