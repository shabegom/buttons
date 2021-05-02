import { Plugin, EventRef, MarkdownView } from "obsidian";
import { createArgumentObject, insertButton } from "./utils";
import {
  initializeButtonStore,
  addButtonToStore,
  getButtonFromStore,
} from "./buttonStore";
import { buttonEventListener, initializeListener } from "./events";
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
  private initializeEvent: EventRef;
  async onload(): Promise<void> {
    this.initializeEvent = initializeListener(this.app, initializeButtonStore);
    this.buttonEvents = buttonEventListener(this.app, addButtonToStore);

    setTimeout(() => {
      this.app.metadataCache.offref(this.initializeEvent);
    }, 500);

    this.addCommand({
      id: "insert-button-template",
      name: "Insert Button",
      callback: () => insertButton(this.app),
    });
    this.registerMarkdownCodeBlockProcessor(
      "button",
      async (source, el, ctx) => {
        // create an object out of the arguments
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
          const content = await this.app.vault.cachedRead(activeView.file);
          let args = createArgumentObject(source);
          const position = ctx.getSectionInfo
            ? ctx.getSectionInfo(el)
            : getButtonPosition(content, args);
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
              template(this.app, args, position);
            }
            if (args.type === "calculate") {
              calculate(this.app, args, position);
            }
            // handle removing the button
            if (args.remove) {
              remove(this.app, args, position);
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
      }
    );
  }
  onunload(): void {
    this.app.metadataCache.offref(this.buttonEvents);
  }
}
