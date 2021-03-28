import { MarkdownView, App, Notice } from "obsidian";
import { Arguments } from "./types";

export const createArgumentObject = (source: string): Arguments =>
  source.split("\n").reduce((acc: Arguments, i: string) => {
    const split: string[] = i.split(" ");
    const key: string = split[0];
    acc[key] = split.filter((item) => item !== split[0]).join(" ");
    return acc;
  }, {});

export const removeButton = async (
  app: App,
  buttonName: string
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const button = `\u0060{3}button\nname ${buttonName}.*?remove true\n\u0060{3}`;
    const re = new RegExp(button, "gms");
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0]} ${splitContent[1]}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
};

export const removeSection = async (
  app: App,
  section: string,
  buttonName: string
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const splitContentBeforeSection = originalContent.split(`\n${section}\n`);
    const button = `\u0060{3}button\nname ${buttonName}.*?\n\u0060{3}`;
    const buttonRe = new RegExp(button, "gms");
    const buttonMatch = originalContent.match(buttonRe);
    const splitContentAfterButton = originalContent.split(buttonRe);
    const content = `${splitContentBeforeSection[0]}\n${section}${buttonMatch[0]}${splitContentAfterButton[1]}`;
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
    const buttonRegex = `\u0060{3}button\nname ${buttonName}.*?\n\u0060{3}`;
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
    const buttonRegex = `\u0060{3}button\nname ${buttonName}.*?\n\u0060{3}`;
    const re = new RegExp(buttonRegex, "gms");
    const button = originalContent.match(re);
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0] ? splitContent[0] : ""}
${button}
${insert}
${splitContent[1] ? splitContent[1] : ""}`;
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
  const path = type.match(/\((.*)\)/);
  if (path) {
    try {
      await app.vault.create(`${path[1]}.md`, content);
      const vault = app.vault.getName();
      window.open(`obsidian://vault/${vault}/${path[1]}`);
    } catch (e) {
      console.log(e);
      new Notice("There was an error!", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
};
