import { Plugin, EventRef, MarkdownView } from "obsidian";
import { createArgumentObject, insertButton } from "./utils";
import {
  initializeButtonStore,
  addButtonToStore,
  getButtonFromStore,
} from "./buttonStore";
import { buttonEventListener, openFileListener } from "./events";
import {
  calculate,
  remove,
  replace,
  template,
  link,
  command,
} from "./buttonTypes";
import { getButtonPosition } from "./parser";

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
        let content = await this.app.vault.cachedRead(activeView.file);
        let args = createArgumentObject(source);
        let position = getButtonPosition(content, args);
        const storeArgs = await getButtonFromStore(this.app, args);
        args = storeArgs ? storeArgs : args;
        // handle button clicks
        const clickHandler = async () => {
          // handle command buttons
          if (args.replace) {
            replace(this.app, args);
          }
          if (args.type === "command") {
            command(this.app, args);
          }
          // handle link buttons
          if (args.type === "link") {
            link(args);
          }
          // handle template buttons
          if (args.type && args.type.includes("template")) {
            setTimeout(async () => {
              content = await this.app.vault.read(activeView.file);
              position = getButtonPosition(content, args);
              template(this.app, args, position);
            }, 50);
          }
          if (args.type === "calculate") {
            calculate(this.app, args, position);
          }
          // handle removing the button
          if (args.remove) {
            setTimeout(async () => {
              content = await this.app.vault.read(activeView.file);
              position = getButtonPosition(content, args);
              remove(this.app, args, position);
            }, 75);
          }
        };
        //create the button element
        const button = el.createEl("button", {
          text: args.name,
          cls: args.class
            ? `${args.class} ${args.color}`
            : `button-default ${args.color ? args.color : ""}`,
        });
        args.id ? button.setAttribute("id", args.id) : "";
        button.on("click", "button", () => {
          clickHandler();
        });
      }
    });
  }
  onunload(): void {
    this.app.metadataCache.offref(this.buttonEvents);
    this.app.metadataCache.offref(this.closedFile);
  }
}
