import { Plugin, TFile } from "obsidian";
import { button } from "./ui";
import buttonPlugin from "./plugin";
import { createArgs } from "./utils";
import { createOnclick } from "./handlers";
import { ButtonCache } from "./types";
import { buildIndex } from "./indexer";

export default class Buttons extends Plugin {
  index: ButtonCache[];
  currentFileButtons: ButtonCache[] = [];

  onload(): void {
    console.log("Buttons loves you");

    this.app.workspace.onLayoutReady(() => {
      this.index = buildIndex(this.app);
      const file = this.app.workspace.getActiveFile();
      this.buildCurrentFileButtons(file);
      this.registerEditorExtension([buttonPlugin(this)]);
    });

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        console.log("metadataCache changed", file.path);
        this.index = buildIndex(this.app);
        this.buildCurrentFileButtons(file);
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", async (file) => {
        this.buildCurrentFileButtons(file);
      })
    );

    this.registerMarkdownCodeBlockProcessor("button", (source, el) => {
      const args = createArgs(source);
      const onClick = createOnclick(args, this.app, this.index);
      button(el, args.name, onClick);
    });
  }
  async buildCurrentFileButtons(file: TFile) {
    const currentFile = await this.app.vault.read(file);
    const inlineButtons = currentFile.match(/button-[\d\w]{1,6}/g);
    if (inlineButtons) {
      console.log("inlineButtons", inlineButtons);
      inlineButtons.forEach(async (button) => {
        const buttonId = button.replace("button-", "");
        const buttonCache = this.index.find((cache) => cache.id === buttonId);
        if (buttonCache) {
          const content = await this.app.vault.read(buttonCache.file);
          const button = content.substring(
            buttonCache.position.start.offset,
            buttonCache.position.end.offset
          );
          const args = createArgs(button);
          this.currentFileButtons.push({
            file: buttonCache.file,
            args,
            button,
            position: buttonCache.position,
            id: buttonCache.id,
          });
        }
      });
    }
  }
}
