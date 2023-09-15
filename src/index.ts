import {
  App,
  EventRef,
  Events,
  MarkdownRenderChild,
  MarkdownView,
  Plugin,
} from "obsidian";
import { createArgumentObject } from "./utils";
import {
  addButtonToStore,
  getButtonById,
  getButtonFromStore,
  getStore,
  initializeButtonStore,
} from "./buttonStore";
import { buttonEventListener, openFileListener } from "./events";
import { Arguments } from "./types";
import { ButtonModal, InlineButtonModal } from "./modal";
import { Button, createButton } from "./button";
// import { updateWarning } from "./version";

export default class ButtonsPlugin extends Plugin {
  private buttonEvents: EventRef;
  private closedFile: EventRef;
  private buttonEdit: EventRef;
  private createButton: Button;
  private storeEvents = new Events();
  private indexCount = 0;
  private storeEventsRef: EventRef;

  private async addButtonInEdit(app: App) {
    let widget: CodeMirror.LineWidget;
    if (widget) {
      widget.clear();
    }
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const store = getStore(app.isMobile);
      const buttonsInFile = store.filter(
        (button) => button.path === activeView.file.path
      );
      this.registerCodeMirror((cm: CodeMirror.Editor) => {
        buttonsInFile.forEach(async (button) => {
          const widgetEl = document.createElement("div");
          const storeButton = await getButtonFromStore(app, {
            id: button.id.split("-")[1],
          });
          if (
            !app.isMobile &&
            storeButton &&
            storeButton?.args.editview === "true"
          ) {
            widget = cm.addLineWidget(
              button.position.end.line + 1,
              createButton({
                app,
                el: widgetEl,
                args: storeButton.args,
                inline: false,
                id: button.id,
              })
            );
          }
        });
      });
    }
  }
  async onload(): Promise<void> {
    this.app.workspace.onLayoutReady(async () => {
      // await updateWarning();
    });
    this.buttonEvents = buttonEventListener(this.app, addButtonToStore);
    this.closedFile = openFileListener(
      this.app,
      this.storeEvents,
      initializeButtonStore
    );
    this.createButton = createButton as Button;
    this.storeEventsRef = this.storeEvents.on("index-complete", () => {
      this.indexCount++;
    });
    initializeButtonStore(this.app, this.storeEvents);

    this.buttonEdit = openFileListener(
      this.app,
      this.storeEvents,
      this.addButtonInEdit.bind(this)
    );

    this.addCommand({
      id: "button-maker",
      name: "Button Maker",
      callback: () => new ButtonModal(this.app).open(),
    });

    this.addCommand({
      id: "inline-button",
      name: "Insert Inline Button",
      callback: () => new InlineButtonModal(this.app).open(),
    });

    this.registerMarkdownCodeBlockProcessor(
      "button",
      async (source, el, ctx) => {
        // create an object out of the arguments
        const file = this.app.vault
          .getFiles()
          .find((f) => f.path === ctx.sourcePath);
        addButtonToStore(this.app, file);
        let args = createArgumentObject(source);
        const storeArgs = await getButtonFromStore(this.app, args);
        args = storeArgs ? storeArgs.args : args;
        const id = storeArgs && storeArgs.id;
        createButton({ app: this.app, el, args, inline: false, id });
      }
    );

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      // Search for <code> blocks inside this element; for each one, look for things of the form `
      const codeblocks = el.querySelectorAll("code");
      for (let index = 0; index < codeblocks.length; index++) {
        const codeblock = codeblocks.item(index);
        const text = codeblock.innerText.trim();
        if (text.startsWith("button")) {
          const id = text.split("button-")[1].trim();
          if (this.indexCount < 2) {
            this.storeEventsRef = this.storeEvents.on(
              "index-complete",
              async () => {
                this.indexCount++;
                const args = await getButtonById(this.app, id);
                if (args) {
                  ctx.addChild(new InlineButton(codeblock, this.app, args, id));
                }
              }
            );
          } else {
            const args = await getButtonById(this.app, id);
            if (args) {
              ctx.addChild(new InlineButton(codeblock, this.app, args, id));
            }
          }
        }
      }
    });
  }
  onunload(): void {
    this.app.metadataCache.offref(this.buttonEvents);
    this.app.workspace.offref(this.closedFile);
    this.app.workspace.offref(this.buttonEdit);
    this.storeEvents.offref(this.storeEventsRef);
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
    const button = createButton({
      app: this.app,
      el: this.el,
      args: this.args,
      inline: true,
      id: this.id,
    });
    this.el.replaceWith(button);
  }
}
