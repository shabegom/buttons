import { App, Notice, MarkdownView} from "obsidian";
import { Arguments } from "./types";
import {
  calculate,
  remove,
  replace,
  template,
  link,
  command,
  swap,
  templater,
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
    params: any[];
    click: (...params: any[]) => void;
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
    cls: args.class
      ? `${args.class} ${args.color}`
      : `button-default ${args.color ? args.color : ""}`,
  });
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
  id: string
) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  let content = await app.vault.read(activeView.file);
  let position = inline
    ? await getInlineButtonPosition(app, id)
    : getButtonPosition(content, args);
  // handle command buttons
  if (args.templater) {
    args = await templater(app, position);
    if (inline) {
      new Notice("templater args don't work with inline buttons yet", 2000);
    }
  }
  if (args.replace) {
    replace(app, args);
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
    content = await app.vault.read(activeView.file);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await template(app, args, position);
  }
  if (args.type === "calculate") {
    await calculate(app, args, position);
  }
  if (args.type && args.type.includes("text")) {
    content = await app.vault.read(activeView.file);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await text(app, args, position);
  }
  if (args.swap) {
    if (!inline) {
      new Notice("swap args only work in inline buttons for now", 2000);
    } else {
      await swap(app, args.swap, id, inline, activeView.file);
    }
  }
  // handle removing the button
  if (args.remove) {
    content = await app.vault.read(activeView.file);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await remove(app, args, position);
  }
};
