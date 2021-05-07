import { App, MarkdownView, Notice, TFile } from "obsidian";
import mexp from "math-expression-evaluator";

import { Arguments, Position } from "./types";
import {
  appendContent,
  createNote,
  prependContent,
  removeButton,
  removeSection,
} from "./handlers";

export const calculate = async (
  app: App,
  { action }: Arguments,
  position: Position
): Promise<void> => {
  let equation = action;
  const variables = action.match(/\$[0-9]*/g);
  if (variables) {
    const output = variables.map(async (value) => {
      const activeView = app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        const file = activeView.file;
        const originalContent = await app.vault.read(file);
        const arr = originalContent.split("\n");
        const lineNumber = parseInt(value.substring(1)) - 1;
        return { variable: value, value: arr[lineNumber].split(" ").pop() };
      } else {
        new Notice(`couldn't read file`, 2000);
      }
    });
    const resolved = await Promise.all(output);
    resolved.forEach((term: { variable: string; value: string }) => {
      equation = equation.replace(term.variable, term.value);
    });
  }
  const fun = mexp.eval(equation);
  appendContent(app, `Result: ${fun}`, position.lineEnd);
};

export const remove = (
  app: App,
  { remove }: Arguments,
  { lineStart, lineEnd }: { lineStart: number; lineEnd: number }
): void => {
  setTimeout(() => removeButton(app, remove, lineStart, lineEnd), 100);
};

export const replace = (app: App, { replace }: Arguments): void => {
  removeSection(app, replace);
};

export const template = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPlugin = app.plugins.plugins["templater-obsidian"];
  // only run if templates plugin is enabled
  if (templatesEnabled || templaterPlugin) {
    const folder = templatesEnabled
      ? app.internalPlugins.plugins.templates.instance.options.folder.toLowerCase()
      : templaterPlugin
      ? templaterPlugin.settings.template_folder.toLowerCase()
      : undefined;
    const templateFile = args.action.toLowerCase();
    const allFiles = app.vault.getFiles();
    const file: TFile = allFiles.filter(
      (file) => file.path.toLowerCase() === `${folder}/${templateFile}.md`
    )[0];
    if (file) {
      const content = await app.vault.read(file);
      // prepend template above the button
      if (args.type.includes("prepend")) {
        prependContent(app, content, position.lineStart, args.replace);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      // append template below the button
      if (args.type.includes("append")) {
        appendContent(app, content, position.lineEnd);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      if (args.type.includes("note")) {
        createNote(app, content, args.type);
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

export const link = ({ action }: Arguments): void => {
  const link = action.trim();
  window.open(link);
};

export const command = (app: App, { action }: Arguments): void => {
  const allCommands = app.commands.listCommands();
  const command = allCommands.filter(
    (command) => command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  app.commands.executeCommandById(command.id);
};
