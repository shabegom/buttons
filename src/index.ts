import {
  App,
  Plugin,
  EventRef,
  MarkdownView,
  MarkdownRenderChild,
} from "obsidian";
import { createArgumentObject } from "./utils";
import {
  initializeButtonStore,
  addButtonToStore,
  getButtonFromStore,
  getButtonById,
} from "./buttonStore";
import { buttonEventListener, openFileListener } from "./events";
import { Arguments } from "./types";
import { ButtonModal } from "./modal";
import { createButton } from "./button";

// extend the obsidian module with some additional typings

export default class ButtonsPlugin extends Plugin {
  private buttonEvents: EventRef;
  private closedFile: EventRef;
  async onload(): Promise<void> {
    initializeButtonStore(this.app);
    this.buttonEvents = buttonEventListener(this.app, addButtonToStore);
    this.closedFile = openFileListener(this.app, initializeButtonStore);

    this.addCommand({
      id: "button-maker",
      name: "Button Maker",
      callback: () => new ButtonModal(this.app).open(),
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
