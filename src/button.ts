import { App, MarkdownView, Notice, MarkdownRenderer, Component } from "obsidian";
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
  component?: Component;
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
  component,
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
  
  MarkdownRenderer.render(
    app,
    args.name,
    button,
    app.workspace.getActiveFile()?.path || "",
    component
  );

  // Changing the button's innerHTML to be wrapped in a div rather than a p so that it is not on a new line
  // Style tags so the user can set the width, height, and alignment of the button

  let numberOfLines = args.name.split('\n').length;
  let paddingTop = 'auto';
  let paddingBottom = 'auto';

  let alignment = args.align?.split(' ') || ['center', 'middle'];

  if (args.height) {

    if (alignment.includes("top")) {
      alignment = alignment.filter((a: string) => a !== "top");
      paddingBottom = (parseFloat(args.height) - 1.2 * numberOfLines) + "em";
    } else if (alignment.includes("bottom")) {
      alignment = alignment.filter((a: string) => a !== "bottom");
      paddingTop = (parseFloat(args.height) - 1.2 * numberOfLines) + "em";
    } else {
      alignment = alignment.filter((a: string) => a !== "middle");
      paddingTop = (parseFloat(args.height) - 1.2 * numberOfLines) / 2 + "em";
      paddingBottom = (parseFloat(args.height) - 1.2 * numberOfLines) / 2 + "em";
    }

  }

  if (args.width) {
    args.width += "em";
  } else {
    args.width = "auto";
  }

  button.innerHTML = "<div style='" + 
    `width: ${args.width};` + 
    `padding-top: ${paddingTop};` + 
    `padding-bottom: ${paddingBottom};` + 
    `text-align: ${alignment[0] || 'center'};` + 
    'line-height: 1.2em;' +
    `'>${button.innerHTML.slice(14, -4)}</div>`;

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
  
  // Process templater commands for all buttons with templater true
  let processedAction = args.action;
  let processedType = args.type;
  
  if (args.templater) {
    try {
      // Both template and target are activeFile since we're processing templater commands within the same file
      const runTemplater = await templater(app, activeFile, activeFile);
      if (runTemplater) {
        // Process action field if it contains templater expressions
        if (args.action && args.action.includes("<%")) {
          processedAction = await runTemplater(args.action);
        }
        
        // Process type field if it contains templater expressions (for note titles)
        if (args.type && args.type.includes("<%")) {
          processedType = await runTemplater(args.type);
        }
      }
    } catch (error) {
      console.error('Error processing templater in button:', error);
      new Notice("Error processing templater in button. Check console for details.", 2000);
    }
  }

  // Create a copy of args with the processed values to avoid mutating the original
  const processedArgs = { ...args, action: processedAction, type: processedType };
  
  if (args.replace) {
    replace(app, processedArgs, position);
  }

  if (processedArgs.type && processedArgs.type.includes("command")) {
    command(app, processedArgs, buttonStart);
  }
  if (processedArgs.type === "copy") {
    copy(processedArgs);
  }
  // handle link buttons
  if (processedArgs.type === "link") {
    link(processedArgs);
  }
  // handle template buttons
  if (processedArgs.type && processedArgs.type.includes("template")) {
    content = await app.vault.read(activeFile);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await template(app, processedArgs, position);
  }
  if (processedArgs.type === "calculate") {
    await calculate(app, processedArgs, position);
  }
  if (processedArgs.type && processedArgs.type.includes("text")) {
    content = await app.vault.read(activeFile);
    position = inline
      ? await getInlineButtonPosition(app, id)
      : getButtonPosition(content, args);
    await text(app, processedArgs, position);
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
    await remove(app, processedArgs, position);
  }
  if (processedArgs.type === "chain") {
    await chain(app, processedArgs, position, inline, id, activeFile);
    return;
  }
};
