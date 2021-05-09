import {
  App,
  Plugin,
  EventRef,
  MarkdownView,
  MarkdownRenderChild,
  Notice,
  Modal,
  DropdownComponent,
  TextComponent,
  ButtonComponent,
  SuggestModal,
} from "obsidian";
import { createArgumentObject } from "./utils";
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
  templater,
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

class ButtonModal extends Modal {
  constructor(app: App) {
    super(app);
  }
  private actionInterval;
  private removeInterval;

  onOpen() {
    const { titleEl, contentEl } = this;
    titleEl.setText("Button Maker");
    const name = contentEl.createEl("div");
    name.createEl("p").setText("Name of Button");
    const btnName = new TextComponent(name).setPlaceholder("My Awesome Button");
    const type = contentEl.createEl("div");
    type.createEl("p").setText("What type of Button would you like to make?");
    const btnType = new DropdownComponent(type)
      .addOption("command", "Command - Run a Command Palette Command")
      .addOption("link", "Link - Open a Link or URI")
      .addOption("append template", "Append Template - Append a template note")
      .addOption(
        "prepend template",
        "Prepend Template - Prepend a template note"
      )
      .addOption(
        "note template",
        "New Note from Template - Create a new note based on a Template"
      )
      .addOption("calculate", "Calculate - Do some math");
    const action = contentEl.createEl("div");
    const actionMessage = action.createEl("p");
    const commandSelector = new TextComponent(action);
    let typeValue;
    this.actionInterval = setInterval(() => {
      typeValue = btnType.getValue();
      if (typeValue === "command") {
        actionMessage.setText("Which command do you want to run?");
        commandSelector.setPlaceholder("Toggle Pin");
      }
      if (typeValue === "link") {
        actionMessage.setText("Which link do you want to open?");
        commandSelector.setPlaceholder("https://obsidian.md");
      }
      if (typeValue.includes("template")) {
        actionMessage.setText("Which template?");
        commandSelector.setPlaceholder("My Sweet Template");
      }
      if (typeValue === "calculate") {
        actionMessage.setText(
          "What is the calculation? You can reference line numbers: $10 = line ten in the note"
        );
        commandSelector.setPlaceholder("2+$2/5");
      }
    }, 100);
    const buttons = contentEl.createEl("div");
    const insertButton = new ButtonComponent(buttons).setButtonText("Submit");
    insertButton.onClick(() => {
      console.log(btnName.getValue(), btnType.getValue());
    });
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
    clearInterval(this.actionInterval);
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
    if (!inline) {
      new Notice("swap args only work in inline buttons for now", 2000);
    } else {
      swap(app, args.swap, id, inline, activeView.file);
    }
  }
};
