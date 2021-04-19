import { Plugin, TFile, App, MarkdownView } from "obsidian";
import { insertButton, createArgumentObject } from "./utils";
import {
  calculate,
  remove,
  replace,
  template,
  link,
  command,
} from "./buttonTypes";
import {
  getButtonFromStore,
  updateButtonArgs,
  cycleEvent,
} from "./buttonStore";
import { addButtonToStore, addButtonId } from "./parser";

// extend the obsidian module with some additional typings

export default class ButtonsPlugin extends Plugin {
  async onload(): Promise<void> {
    addIdtoButtons(this.app);
    addAllButtonsToStore(this.app);
    document.addEventListener("keydown", () => {
      cycleEvent();
    });

    this.addCommand({
      id: "insert-button-template",
      name: "Insert Button",
      callback: () => insertButton(this.app),
    });

    this.registerMarkdownCodeBlockProcessor("button", async (source, el) => {
      const createdArgs = createArgumentObject(source);
      const buttonObj = getButtonFromStore(createdArgs.id);
      if (!buttonObj) {
        addIdtoButtons(this.app);
        cycleEvent();
        addAllButtonsToStore(this.app);
        cycleEvent();
      }
      if (
        buttonObj &&
        JSON.stringify(buttonObj.args) !== JSON.stringify(createdArgs)
      ) {
        updateButtonArgs(createdArgs, buttonObj.id);
      }
      console.log(buttonObj);
      const args = buttonObj ? buttonObj.args : createdArgs;
      // create an object out of the arguments
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
    });
  }
}

const addAllButtonsToStore = (app: App) => {
  const files = app.vault.getMarkdownFiles();
  files.map(async (file: TFile) => {
    const text = await app.vault.read(file);
    addButtonToStore(text, file.path);
  });
};

const addIdtoButtons = (app: App) => {
  const files = app.vault.getMarkdownFiles();
  files.map(async (file: TFile) => {
    const text = await app.vault.read(file);
    const newText = addButtonId(text);
    await app.vault.modify(file, newText);
    cycleEvent();
  });
};

const getFile = async (app: App): Promise<{ note: string; path: string }> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  return {
    note: await app.vault.read(activeView.file),
    path: activeView.file.path,
  };
};
