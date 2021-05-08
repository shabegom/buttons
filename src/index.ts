import {
  App,
  Plugin,
  EventRef,
  MarkdownView,
  MarkdownRenderChild,
} from "obsidian";
import { createArgumentObject, insertButton } from "./utils";
import {
  initializeButtonStore,
  addButtonToStore,
  getButtonFromStore,
  getButtonById,
} from "./buttonStore";
import { buttonEventListener, openFileListener } from "./events";
import {
  calculate,
  remove,
  replace,
  template,
  link,
  command,
  swap,
} from "./buttonTypes";
import { getButtonPosition, getInlineButtonPosition } from "./parser";
import { Arguments } from "./types";

// extend the obsidian module with some additional typings

export default class ButtonsPlugin extends Plugin {
  private buttonEvents: EventRef;
  private closedFile: EventRef;
  async onload(): Promise<void> {
    initializeButtonStore(this.app);
    this.buttonEvents = buttonEventListener(this.app, addButtonToStore);
    this.closedFile = openFileListener(this.app, initializeButtonStore);

    this.addCommand({
      id: "insert-button-template",
      name: "Insert Button",
      callback: () => insertButton(this.app),
    });
    this.registerMarkdownCodeBlockProcessor("button", async (source, el) => {
      // create an object out of the arguments
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        addButtonToStore(this.app, activeView.file);
        let args = createArgumentObject(source);
        const storeArgs = await getButtonFromStore(this.app, args);
        args = storeArgs ? storeArgs.args : args;
        const id = storeArgs && storeArgs.id;
        createButton(this.app, el, args, false, id);
      }
    });

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      // Search for <code> blocks inside this element; for each one, look for things of the form `
      const codeblocks = el.querySelectorAll("code");
      for (let index = 0; index < codeblocks.length; index++) {
        const codeblock = codeblocks.item(index);

        const text = codeblock.innerText.trim();
        if (text.startsWith("button")) {
          const id = text.split("button-")[1].trim();
          const args = await getButtonById(this.app, id);
          if (args) {
            ctx.addChild(new InlineButton(codeblock, this.app, args, id));
          }
        }
      }
    });
  }
  onunload(): void {
    this.app.metadataCache.offref(this.buttonEvents);
    this.app.metadataCache.offref(this.closedFile);
  }
}

class InlineButton extends MarkdownRenderChild {
  constructor(
    public el: HTMLElement,
    public app: App,
    public args: Arguments,
    public id: string
  ) {
    super(el);
  }
  async onload() {
    const button = createButton(this.app, this.el, this.args, true, this.id);
    this.el.replaceWith(button);
  }
}

const createButton = (
  app: App,
  el: HTMLElement,
  args: Arguments,
  inline: boolean,
  id?: string
): HTMLElement => {
  //create the button element
  const button = el.createEl("button", {
    text: args.name,
    cls: args.class
      ? `${args.class} ${args.color}`
      : `button-default ${args.color ? args.color : ""}`,
  });
  args.id ? button.setAttribute("id", args.id) : "";
  button.on("click", "button", () => {
    clickHandler(app, args, inline, id);
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
    setTimeout(async () => {
      content = await app.vault.read(activeView.file);
      position = inline
        ? await getInlineButtonPosition(app, id)
        : getButtonPosition(content, args);
      template(app, args, position);
    }, 50);
  }
  if (args.type === "calculate") {
    calculate(app, args, position);
  }
  // handle removing the button
  if (args.remove) {
    setTimeout(async () => {
      content = await app.vault.read(activeView.file);
      position = inline
        ? await getInlineButtonPosition(app, id)
        : getButtonPosition(content, args);
      remove(app, args, position);
    }, 75);
  }
  if (args.swap) {
    swap(app, args.swap, id, inline, activeView.file);
  }
};
