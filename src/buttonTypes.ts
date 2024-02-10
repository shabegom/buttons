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
import { handleValueArray, getNewArgs } from "./utils";
import {
  getButtonSwapById,
  setButtonSwapById,
  getButtonById,
} from "./buttonStore";
import {processTemplate} from "./templater"

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
    await prependContent(app, args.action, position.lineStart, false);
  }
  // append template below the button
  if (args.type.includes("append")) {
    await appendContent(app, args.action, position.lineEnd, false);
  }
  if (args.type.includes("note")) {
    createNote(app, args.type, args.folder, args.prompt, args.action, false);
  }
  if (args.type.includes("line")) {
    await addContentAtLine(app, args.action, args.type, false);
  }
};

export const template = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPluginEnabled = app.plugins.plugins["templater-obsidian"];
  let isTemplater = false
  const templateFile = args.action.toLowerCase();
  const allFiles = app.vault.getFiles();
  let file = null

  if (templatesEnabled || templaterPluginEnabled) {
  if (templatesEnabled) {
    const folder: string = 
      templatesEnabled &&
        app.internalPlugins.plugins.templates.instance.options.folder?.toLowerCase()
    const isFound = allFiles.filter((file) => {
      let found = false;
          if (file.path.toLowerCase() === `${folder}/${templateFile}.md`) {
            found = true;
          }
        return found
    })
      file = isFound[0]
  }

  if (!file && templaterPluginEnabled) {
    const folder: string = 
      templaterPluginEnabled &&
        app.plugins?.plugins[
          "templater-obsidian"
        ]?.settings.templates_folder?.toLowerCase()
    const isFound = allFiles.filter((file) => {
      let found = false;
          if (file.path.toLowerCase() === `${folder}/${templateFile}.md`) {
            found = true;
            isTemplater = true;
          }
      return found;
    })
      file = isFound[0]
  }

    if (file) {
      // prepend template above the button
      if (args.type.includes("prepend")) {
        await prependContent(app, file, position.lineStart, isTemplater);
      }
      // append template below the button
      if (args.type.includes("append")) {
        await appendContent(app, file, position.lineEnd, isTemplater);
      }
      if (args.type.includes("note")) {
        createNote(app, args.type, args.folder, args.prompt, file, isTemplater);
      }
      if (args.type.includes("line")) {
        await addContentAtLine(app, file, args.type, isTemplater);
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

// take the action and copy it to the clipboard
export const copy = ({ action }: Arguments): void => {
  navigator.clipboard.writeText(action);
}

export const command = (app: App, args: Arguments, buttonStart): void => {

  const allCommands = app.commands.listCommands();
  const action = args.action;
  const command = allCommands.filter(
    (command) => command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  if (args.type.includes("prepend")) {
    app.workspace.getActiveViewOfType(MarkdownView).editor.setCursor(buttonStart.lineStart,0);
    app.commands.executeCommandById(command.id);
  }
  if (args.type.includes("append")) {
    app.workspace.getActiveViewOfType(MarkdownView).editor.setCursor(buttonStart.lineEnd+2,0);
    app.commands.executeCommandById(command.id);
  }
  if (args.type === "command") {
    app.commands.executeCommandById(command.id);
  }
};

export const swap = async (
  app: App,
  swap: string,
  id: string,
  inline: boolean,
  file: TFile,
  buttonStart
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
        command(app, args, buttonStart);
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
    const content = await processTemplate(file);
    const { args } = await getNewArgs(app, position);
    const cachedData: string[] = [];
    const cacheChange = app.vault.on("modify", (file) => {
      cachedData.push(file.unsafeCachedData);
    });
    setTimeout(async () => {
      const button = content
        .split("\n")
        .splice(position.lineStart, position.lineEnd - position.lineStart + 2)
        .join("\n");
      let finalContent;
      if (cachedData[0]) {
        const cachedContent = cachedData[cachedData.length - 1].split("\n");
        let addOne = false;
        if (args.type.includes("prepend")) {
          addOne = true;
        } else if (args.type.includes("line")) {
          const lineNumber = args.type.match(/(\d+)/g);
          if (lineNumber[0]) {
            const line = parseInt(lineNumber[0]) - 1;
            if (line < position.lineStart && !args.replace) {
              addOne = true;
            }
          }
        }
        if (addOne) {
          cachedContent.splice(
            position.lineStart + 1,
            position.lineEnd - position.lineStart + 2,
            button
          );
        } else {
          cachedContent.splice(
            position.lineStart,
            position.lineEnd - position.lineStart + 2,
            button
          );
        }
        finalContent = cachedContent.join("\n");
      } else {
        finalContent = content;
      }
      await app.vault.modify(file, finalContent);
      app.metadataCache.offref(cacheChange);
    }, 200);
    return args;
  }
};

