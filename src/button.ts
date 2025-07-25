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
  chain, // <-- Add chain import
} from "./buttonTypes";
import { getButtonPosition, getInlineButtonPosition } from "./parser";
import templater from "./templater";

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
  let buttonElement: HTMLElement;

  if (args.type === "link" && args.action) {
    // Create an <a> tag for link buttons to ensure PDF compatibility
    const linkElement = el.createEl("a", {
      cls: [
        args.class
          ? `${args.class} ${args.color}`
          : `button-default ${args.color ? args.color : ""}`,
        inline ? "button-inline" : "",
      ],
      href: args.action.trim(),
      text: args.name,
    });
    linkElement.setAttr("target", "_blank"); // Open link in a new tab

    // Apply all button styles directly to the <a> tag
    linkElement.style.backgroundColor = "var(--interactive-normal, #f5f6f8)";
    linkElement.style.borderRadius = "5px";
    linkElement.style.border = "1px solid var(--interactive-accent, #ccc)";
    linkElement.style.color = "var(--text-accent, #333)";
    linkElement.style.padding = "10px 30px";
    linkElement.style.textDecoration = "none";
    linkElement.style.fontSize = "var(--button-size, 1em)";
    linkElement.style.margin = "0";
    linkElement.style.boxShadow = "none";
    linkElement.style.transform = "none";
    linkElement.style.display = "inline-block";

    if (inline) {
      linkElement.style.width = "unset";
      linkElement.style.height = "unset";
      linkElement.style.padding = "0 8px";
    }

    buttonElement = linkElement;
  } else {
    // Create a <button> element for other button types
    const button = el.createEl("button", {
      cls: [
        args.class
          ? `${args.class} ${args.color}`
          : `button-default ${args.color ? args.color : ""}`,
        inline ? "button-inline" : "",
      ],
    });
    button.innerHTML = args.name;
    button.on("click", "button", () => {
      clickOverride
        ? clickOverride.click(...clickOverride.params)
        : clickHandler(app, args, inline, id);
    });
    buttonElement = button;
  }

  if (args.customcolor) {
    buttonElement.style.backgroundColor = args.customcolor;
  }
  if (args.customtextcolor) {
    buttonElement.style.color = args.customtextcolor;
  }
  args.id ? buttonElement.setAttribute("id", args.id) : "";

  return buttonElement;
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
  
  // Process templater commands for inline buttons only
  if (inline && args.templater && args.action && args.action.includes("<%")) {
    try {
      // Both template and target are activeFile since we're processing templater commands within the same file
      const runTemplater = await templater(app, activeFile, activeFile);
      if (runTemplater) {
        args.action = await runTemplater(args.action);
      }
    } catch (error) {
      console.error('Error processing templater in inline button:', error);
      new Notice("Error processing templater in inline button. Check console for details.", 2000);
    }
  }
  
  if (args.replace) {
    replace(app, args, position);
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
  if (args.type === "chain") {
    await chain(app, args, position, inline, id, activeFile);
    return;
  }
};
