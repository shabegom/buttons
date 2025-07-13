import { App, MarkdownView, Notice } from "obsidian";
import { Arguments } from "./types";
import {
  calculate,
  command,
  copy,
  link,
  remove,
  replace,
  swap,
  template,
  text,
} from "./buttonTypes";
import { getButtonPosition, getInlineButtonPosition } from "./parser";

export interface Button {
  app?: App;
  el?: HTMLElement;
  args?: Arguments;
  inline?: boolean;
  id?: string;
  clickOverride?: {
    params: unknown[];
    click: (...params: unknown[]) => void;
  };
}

export const createButton = ({
  app,
  el,
  args,
  inline,
  id,
  clickOverride,
}: Button): HTMLElement => {
  //create the button element
  const button = el.createEl("button", {
    cls: [
      args.class
        ? `${args.class} ${args.color}`
        : `button-default ${args.color ? args.color : ""}`,
      inline ? "button-inline" : "",
    ],
  });

  if (args.customcolor) {
    button.style.backgroundColor = args.customcolor;
  }
  if (args.customtextcolor) {
    button.style.color = args.customtextcolor;
  }
  button.innerHTML = args.name;
  args.id ? button.setAttribute("id", args.id) : "";
  button.on("click", "button", () => {
    clickOverride
      ? clickOverride.click(...clickOverride.params)
      : clickHandler(app, args, inline, id);
  });
  return button;
};

const clickHandler = async (
  app: App,
  args: Arguments,
  inline: boolean,
  id: string,
) => {
  // First try to get MarkdownView, then fallback to active file
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const activeFile = activeView?.file || app.workspace.getActiveFile();
  
  if (!activeFile) {
    new Notice("No active file found. Buttons can only be used with files.");
    return;
  }
  
  let content = await app.vault.read(activeFile);
  const buttonStart = getButtonPosition(content, args);
  let position = inline
    ? await getInlineButtonPosition(app, id)
    : getButtonPosition(content, args);
  // if (args.templater) {
  //   args = await templater(app, position);
  //   if (inline) {
  //     new Notice("templater args don't work with inline buttons yet", 2000);
  //   }
  // }
  if (args.replace) {
    replace(app, args);
  }

  if (args.type && args.type.includes("command")) {
    command(app, args, buttonStart);
  }
  if (args.type === "copy") {
    copy(args);
  }
  // handle link buttons
  if (args.type === "link") {
    link(args);
  }
  // handle template buttons
  if (args.type && args.type.includes("template")) {
    content = await app.vault.read(activeFile);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await template(app, args, position);
  }
  if (args.type === "calculate") {
    await calculate(app, args, position);
  }
  if (args.type && args.type.includes("text")) {
    content = await app.vault.read(activeFile);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await text(app, args, position);
  }
  if (args.swap) {
    if (!inline) {
      new Notice("swap args only work in inline buttons for now", 2000);
    } else {
      await swap(app, args.swap, id, inline, activeFile, buttonStart);
    }
  }
  // handle removing the button
  if (args.remove) {
    content = await app.vault.read(activeFile);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await remove(app, args, position);
  }
};
