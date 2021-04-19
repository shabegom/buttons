import { Plugin } from "obsidian";
import { createArgumentObject, insertButton } from "./utils";
import {
  calculate,
  remove,
  replace,
  template,
  link,
  command,
} from "./buttonTypes";
import {
  createButtonStore,
  getButtonFromStore,
  addIdsToButtons,
} from "./buttonStore";

// extend the obsidian module with some additional typings

export default class ButtonsPlugin extends Plugin {
  async onload(): Promise<void> {
    addIdsToButtons(this.app);
    createButtonStore(this.app);

    this.addCommand({
      id: "insert-button-template",
      name: "Insert Button",
      callback: () => insertButton(this.app),
    });

    this.registerMarkdownCodeBlockProcessor("button", async (source, el) => {
      // create an object out of the arguments
      if (source.includes(" ")) {
        const sourceArgs = createArgumentObject(source);
        const buttonObject = await getButtonFromStore(this.app, sourceArgs);
        const args = buttonObject ? buttonObject.args : sourceArgs;
        // handle button clicks
        const clickHandler = async () => {
          // handle command buttons
          if (args.replace) {
            replace(this.app, args);
          }
          if (args.type) {
            if (args.type === "command") {
              command(this.app, args);
            }
            // handle link buttons
            if (args.type === "link") {
              link(args);
            }
            // handle template buttons
            if (args.type.includes("template")) {
              template(this.app, args);
            }
            if (args.type === "calculate") {
              calculate(this.app, args);
            }
          }
          // handle removing the button
          if (args.remove) {
            remove(this.app, args);
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
}
