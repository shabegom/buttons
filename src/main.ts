import { debounce, Plugin, TFile } from "obsidian";
import { button, InlineButton } from "./ui";
import buttonPlugin from "./cmPlugin";
import { createArgs, templater } from "./utils";
import { createOnclick } from "./handlers";
import { ButtonCache } from "./types";
import { buildIndex } from "./indexer";

export default class Buttons extends Plugin {
  index: ButtonCache[];
  currentFileButtons: ButtonCache[] = [];

  async onload(): Promise<void> {
    console.log("Buttons loves you");

    const currentFileButtonDebouncer = debounce(async (file: TFile) => {
      await this.buildCurrentFileButtons(file);
    }, 500);

    const indexDebouncer = debounce(() => {
      this.index = buildIndex(this.app);
    }, 500);

    this.registerEditorExtension([buttonPlugin(this)]);

    this.app.workspace.onLayoutReady(() => {
      this.index = buildIndex(this.app);
      const file = this.app.workspace.getActiveFile();
      this.buildCurrentFileButtons(file);
    });

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        console.log("metadataCache changed", file.path);
        indexDebouncer();
        currentFileButtonDebouncer(file);
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", async (file) => {
        currentFileButtonDebouncer(file);
      })
    );

    this.registerEvent(
      this.app.workspace.on("layout-change", async () => {
        const file = this.app.workspace.getActiveFile();
        if (file) {
          currentFileButtonDebouncer(file);
        }
      })
    );

    this.registerMarkdownCodeBlockProcessor(
      "button",
      async (source, el, ctx) => {
        const activeFile = this.app.workspace.getActiveFile();
        const sectionInfo = ctx.getSectionInfo(el);
        if (source.includes("<%")) {
          const runTemplater = await templater(this.app, activeFile);
          source = await runTemplater(source);
        }
        const args = createArgs(source);
        const currentButton = this.getCurrentButton(source, sectionInfo.text);
        const onClick = createOnclick(
          args,
          this.app,
          this.index,
          currentButton
        );
        button(el, args.name, onClick, args.class, args.color);
      }
    );

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      const codeBlocks = el.querySelectorAll("code");
      for (let index = 0; index < codeBlocks.length; index++) {
        const codeBlock = codeBlocks[index];
        const code = codeBlock.innerText;
        const match = code.match(/button-([\d\w]{1,6})/);
        if (match) {
          const id = match[1];
          const currentButton = this.currentFileButtons.find(
            (cache) => cache.id === id
          );
          if (currentButton) {
            const onClick = createOnclick(
              currentButton.args,
              this.app,
              this.index,
              currentButton
            );
            ctx.addChild(
              new InlineButton(
                codeBlock,
                onClick,
                currentButton.args.name,
                currentButton.args.class,
                currentButton.args.color
              )
            );
          }
        }
      }
    });
  }
  getCurrentButton(source: string, content: string) {
    const idLine = content
      .split("\n")
      .filter((line) => line !== "")
      .reduce((acc, line, index) => {
        if (source.includes(line)) {
          acc = index + 2;
        }
        return acc;
      }, 0);
    const id = content.split("\n")[idLine].replace("^button-", "");
    const currentButton = this.currentFileButtons.find(
      (cache) => cache.id === id
    );
    return currentButton;
  }
  /**
   * Looks for buttons in the current file and builds the cache
   * @param file - a TFile object of the file in the active view
   */
  async buildCurrentFileButtons(file: TFile) {
    this.currentFileButtons = [];
    const currentFile: string = await this.app.vault.read(file);
    const inlineButtons = currentFile.match(/button-[\d\w]{1,6}/g);
    if (inlineButtons) {
      inlineButtons.forEach(async (button) => {
        let inlinePosition: {
          line?: number;
          ch?: { start: number; end: number };
        };
        currentFile.split("\n").forEach((line, index) => {
          if (line.includes(button)) {
            inlinePosition = { line: index + 1 };
            inlinePosition.line = index;
            let charsOnLine = 0;
            line.split(" ").forEach((word, ix) => {
              const length = word.length + ix;
              charsOnLine += length;
              if (word.includes(button)) {
                inlinePosition.ch = {
                  start: charsOnLine - word.length,
                  end: charsOnLine,
                };
              }
            });
          }
        });
        const buttonId = button.replace("button-", "");
        const buttonCache = this.index.find((cache) => cache.id === buttonId);
        if (buttonCache) {
          const content = await this.app.vault.read(buttonCache.file);
          let button = content.substring(
            buttonCache.position.start.offset,
            buttonCache.position.end.offset
          );
          if (button.includes("<%")) {
            const runTemplater = await templater(this.app, file);
            button = await runTemplater(button);
          }
          const args = createArgs(button);
          this.currentFileButtons.push({
            file: buttonCache.file,
            args,
            button,
            inlinePosition,
            position: buttonCache.position,
            id: buttonCache.id,
          });
        }
      });
    }
  }
}
