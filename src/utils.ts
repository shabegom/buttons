import { MarkdownView, App, Notice, TFile } from "obsidian";
import { Arguments, Position } from "./types";
import { addButtonToStore } from "./buttonStore";

function nanoid(num: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface OutputObject {
  name: string;
  type: string;
  action: string;
  swap: string;
  remove: string;
  replace: string;
  id: string;
  templater: boolean;
  class: string;
  color: string;
  blockId: string;
}

export const insertButton = (app: App, outputObject: OutputObject): void => {
  const buttonArr = [];
  buttonArr.push("```button");
  outputObject.name && buttonArr.push(`name ${outputObject.name}`);
  outputObject.type && buttonArr.push(`type ${outputObject.type}`);
  outputObject.action && buttonArr.push(`action ${outputObject.action}`);
  outputObject.id && buttonArr.push(`id ${outputObject.id}`);
  outputObject.swap && buttonArr.push(`swap ${outputObject.swap}`);
  outputObject.remove && buttonArr.push(`remove ${outputObject.remove}`);
  outputObject.replace && buttonArr.push(`replace ${outputObject.replace}`);
  outputObject.templater === true &&
    buttonArr.push(`templater ${outputObject.templater}`);
  outputObject.color && buttonArr.push(`color ${outputObject.color}`);
  outputObject.class && buttonArr.push(`class ${outputObject.class}`);
  buttonArr.push("```");
  outputObject.blockId
    ? buttonArr.push(`^button-${outputObject.blockId}`)
    : buttonArr.push(`^button-${nanoid(4)}`);
  const page = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = page.editor;
  editor.replaceSelection(buttonArr.join("\n"));
  addButtonToStore(app, page.file);
};

export const insertInlineButton = (app: App, id: string): void => {
  const page = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = page.editor;
  editor.replaceSelection(`\`button-${id}\``);
};

export const createArgumentObject = (source: string): Arguments =>
  source.split("\n").reduce((acc: Arguments, i: string) => {
    const split: string[] = i.split(" ");
    const key: string = split[0].toLowerCase();
    acc[key] = split.filter((item) => item !== split[0]).join(" ").trim();
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

export async function getNewArgs(
  app: App,
  position: Position
): Promise<{ args: Arguments }> {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const newContent = await app.vault
    .cachedRead(activeView.file)
    .then((content: string) => content.split("\n"));
  const newButton = newContent
    .splice(position.lineStart, position.lineEnd - position.lineStart)
    .join("\n")
    .replace("```button", "")
    .replace("```", "");
  return { args: createArgumentObject(newButton) };
}

export const wrapAround = (value: number, size: number): number => {
  return ((value % size) + size) % size;
};

/**
 * Run Templater's "Replace templates in the active file" command and wait until complete.
 */
export const runTemplater = (
  app: App
): Promise<{
  file: TFile;
  content: string;
}> =>
  new Promise((resolve) => {
    const ref = app.workspace.on(
      "templater:overwrite-file",
      (file: TFile, content: string) => {
        app.workspace.offref(ref);
        resolve({ file, content });
      }
    );
    app.commands.executeCommandById(
      "templater-obsidian:replace-in-file-templater"
    );
  });
