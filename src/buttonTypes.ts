import { App, MarkdownView, Notice, TFile } from "obsidian";
import mexp from "math-expression-evaluator";

import { Args } from "./types";
import {
  appendContent,
  createNote,
  prependContent,
  removeSection,
} from "./utils";
import { findNumber } from "./parser";

export const calculate = async (
  app: App,
  { name, action }: Args
): Promise<void> => {
  let equation = action;
  const variables = action.match(/\$[0-9]*/g);
  if (variables) {
    const output = variables.map(async (value) => {
      const activeView = app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        const file = activeView.file;
        const originalContent = await app.vault.read(file);
        const lineNumber = parseInt(value.substring(1));
        const numbers = findNumber(originalContent, lineNumber);
        return { variable: value, numbers };
      } else {
        new Notice(`couldn't read file`, 2000);
      }
    });
    const resolved = await Promise.all(output);
    resolved.forEach((term: { variable: string; numbers: string[] }) => {
      equation = equation.replace(term.variable, term.numbers.join(""));
    });
  }
  const fun = mexp.eval(equation);
  appendContent(app, `Result: ${fun}`, name);
};

export const remove = async (app: App, { id }: Args): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const note = await app.vault.read(file);
    const newNote = removeButton(note, id);
    await app.vault.modify(file, newNote);
  }
};

export const replace = (app: App, { replace, name }: Args): void => {
  removeSection(app, replace, name);
};

export const template = async (
  app: App,
  { name, type, action }: Args
): Promise<void> => {
  console.log("template button");
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPlugin = app.plugins.plugins["templater-obsidian"];
  console.log(templatesEnabled, templaterPlugin);
  // only run if templates plugin is enabled
  if (templatesEnabled || templaterPlugin) {
    const folder = templatesEnabled
      ? app.internalPlugins.plugins.templates.instance.options.folder.toLowerCase()
      : templaterPlugin
      ? templaterPlugin.settings.template_folder.toLowerCase()
      : undefined;
    console.log(folder);
    const templateFile = action.toLowerCase();
    const allFiles = app.vault.getFiles();
    const file: TFile = allFiles.filter(
      (file) => file.path.toLowerCase() === `${folder}/${templateFile}.md`
    )[0];
    if (file) {
      const content = await app.vault.read(file);
      // prepend template above the button
      if (type.includes("prepend")) {
        prependContent(app, content, name);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      // append template below the button
      if (type.includes("append")) {
        appendContent(app, content, name);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      if (type.includes("note")) {
        createNote(app, content, type);
      }
    } else {
      new Notice(
        `Couldn't find the specified template, please check and try again`,
        2000
      );
    }
  } else {
    new Notice(
      "You need to have the Templates or Templater plugin enabled and Template folder defined",
      2000
    );
  }
};

export const link = ({ action }: Args): void => {
  const link = action.trim();
  window.open(link);
};

export const command = (app: App, { action }: Args): void => {
  const allCommands = app.commands.listCommands();
  const command = allCommands.filter(
    (command) => command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  app.commands.executeCommandById(command.id);
};
