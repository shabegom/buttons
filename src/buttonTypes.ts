import { App, MarkdownView, Notice, TFile } from "obsidian";
import mexp from "math-expression-evaluator";

import { Arguments, Position } from "./types";
import {
  appendContent,
  createNote,
  prependContent,
  addContentAtLine,
  removeButton,
  removeSection,
} from "./handlers";
import {
  getButtonPosition,
  getInlineButtonPosition,
  findNumber,
} from "./parser";
import { handleValueArray, getNewArgs, runTemplater } from "./utils";
import {
  getButtonSwapById,
  setButtonSwapById,
  getButtonById,
} from "./buttonStore";

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
        const lineNumber = parseInt(value.substring(1));
        const numbers = await findNumber(app, lineNumber);
        return { variable: value, numbers };
      } else {
        new Notice(`couldn't read file`, 2000);
      }
    });
    const resolved = await Promise.all(output);
    resolved.forEach((term: { variable: string; numbers: string[] }) => {
      if (term.numbers) {
        equation = equation.replace(term.variable, term.numbers.join(""));
      } else {
        new Notice("Check the line number in your calculate button", 3000);
        equation = undefined;
      }
    });
  }
  const fun = equation && mexp.eval(equation);
  fun && appendContent(app, `Result: ${fun}`, position.lineEnd);
};

export const remove = async (
  app: App,
  { remove }: Arguments,
  { lineStart, lineEnd }: { lineStart: number; lineEnd: number }
): Promise<void> => {
  await removeButton(app, remove, lineStart, lineEnd);
};

export const replace = async (
  app: App,
  { replace }: Arguments
): Promise<void> => {
  await removeSection(app, replace);
};
export const text = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  // prepend template above the button
  if (args.type.includes("prepend")) {
    await prependContent(app, args.action, position.lineStart);
  }
  // append template below the button
  if (args.type.includes("append")) {
    await appendContent(app, args.action, position.lineEnd);
  }
  if (args.type.includes("note")) {
    await createNote(app, args.action, args.type);
  }
  if (args.type.includes("line")) {
    await addContentAtLine(app, args.action, args.type);
  }
};

export const template = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPluginEnabled =
    app.plugins.plugins["templater-obsidian"];

  // only run if templates plugin is enabled
  if (templatesEnabled || templaterPluginEnabled) {
    const folders: string[] = [
      templatesEnabled && app.internalPlugins.plugins.templates.instance.options.folder?.toLowerCase(),
      templaterPluginEnabled && app.plugins?.plugins[
        "templater-obsidian"
      ]?.settings.template_folder?.toLowerCase(),
      templaterPluginEnabled && app.plugins?.plugins[
        "templater-obsidian"
      ]?.settings.templates_folder?.toLowerCase(),
    ].filter((folder) => folder);
    const templateFile = args.action.toLowerCase();
    const allFiles = app.vault.getFiles();
    const file: TFile = allFiles.filter((file) => {
      let found = false;
      folders[0] &&
        folders.forEach((folder) => {
          if (file.path.toLowerCase() === `${folder}/${templateFile}.md`) {
            found = true;
          }
        });
      return found;
    })[0];
    if (file) {
      const content = await app.vault.read(file);
      // prepend template above the button
      if (args.type.includes("prepend")) {
        await prependContent(app, content, position.lineStart);
        await runTemplater(app);
      }
      // append template below the button
      if (args.type.includes("append")) {
        await appendContent(app, content, position.lineEnd);
        await runTemplater(app);
      }
      if (args.type.includes("note")) {
        await createNote(app, content, args.type);
      }
      if (args.type.includes("line")) {
        await addContentAtLine(app, content, args.type);
        await runTemplater(app);
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

export const swap = async (
  app: App,
  swap: string,
  id: string,
  inline: boolean,
  file: TFile
): Promise<void> => {
  handleValueArray(swap, async (argArray) => {
    const swap = await getButtonSwapById(app, id);
    const newSwap = swap + 1 > argArray.length - 1 ? 0 : swap + 1;
    setButtonSwapById(app, id, newSwap);
    let args = await getButtonById(app, argArray[swap]);
    let position;
    let content;
    if (args) {
      if (args.templater) {
        args = await templater(app, position);
        if (inline) {
          new Notice("templater args don't work with inline buttons yet", 2000);
        }
      }
      if (args.replace) {
        await replace(app, args);
      }
      if (args.type === "command") {
        command(app, args);
      }
      // handle link buttons
      if (args.type === "link") {
        link(args);
      }
      // handle template buttons
      if (args.type && args.type.includes("template")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await template(app, args, position);
      }
      if (args.type === "calculate") {
        await calculate(app, args, position);
      }
      if (args.type && args.type.includes("text")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await text(app, args, position);
      }
      // handle removing the button
      if (args.remove) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await remove(app, args, position);
      }
      if (args.replace) {
        await replace(app, args);
      }
    }
  });
};

export const templater = async (
  app: App,
  position: Position
): Promise<Arguments> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    await activeView.save();
    const file = activeView.file;
    const content = await app.vault.cachedRead(file);
    await runTemplater(app);
    const { args } = await getNewArgs(app, position);
    await app.vault.modify(file, content);
    return args;
  }
};
