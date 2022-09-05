import { Plugin } from "obsidian";
import buttonPlugin from "./livePreview";
import { createOnclick } from "./handlers";
import { buildIndex } from "./indexer";
import { ButtonCache, SwapCache } from "./types";
import { button, ButtonMaker, InlineButton } from "./ui";
import { createArgs, templater } from "./utils";
import showErrorMessage from "./error";

export default class Buttons extends Plugin {
  swapCache: SwapCache[] = [];
  errors: string[] = [];

  async onload(): Promise<void> {
    console.log("Buttons loves you");

    this.registerEditorExtension([buttonPlugin(this)]);

    this.addCommand({
      id: "button-maker",
      name: "Button Maker",
      callback: () => new ButtonMaker(app).open(),
    });

    this.registerMarkdownCodeBlockProcessor(
      "button",
      async (source, el, ctx): Promise<void> => {
        this.errors = [];
        const activeFile = this.app.workspace.getActiveFile();
        const sectionInfo = ctx.getSectionInfo(el);
        if (source.includes("<%")) {
          const runTemplater = await templater(activeFile);
          source = await runTemplater(source);
        }
        const currentButton = this.getCurrentButton(source, sectionInfo.text);
        const args = createArgs(source);
        if (!args.name) {
          args.name = "Give me a name please";
        }
        if (currentButton) {
          currentButton.args = args;
          const onClick = createOnclick(this, currentButton);
          if (this.errors.length === 0) {
            button(
              el,
              currentButton.args.name,
              onClick,
              currentButton.args.class,
              currentButton.args.color
            );
          }
        }
        if (this.errors.length > 0) {
          const span = document.createElement("span");
          span.innerText = showErrorMessage(
            this.errors,
            "There was a problem rendering this button:\n"
          );
          el.replaceWith(span);
        }
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
          const indexedButton = await this.getInlineButton(id);
          const onClick = createOnclick(this, indexedButton);
          ctx.addChild(
            new InlineButton(
              codeBlock,
              indexedButton.args.name,
              onClick,
              indexedButton.args.class,
              indexedButton.args.color
            )
          );
        }
      }
    });
  }

  async getInlineButton(id: string) {
    const index = buildIndex();
    const indexedButton = index.find((button) => button.id === id);
    if (indexedButton) {
      const file = indexedButton.file;
      const content = await app.vault.read(file);
      const codeblock = content
        .split("\n")
        .reduce((acc, line, index) => {
          if (
            index >= indexedButton.position.start.line &&
            index <= indexedButton.position.end.line &&
            !line.includes("`")
          ) {
            acc.push(line);
          }
          return acc;
        }, [])
        .join("\n");
      const args = createArgs(codeblock);
      indexedButton.args = args;
      return indexedButton;
    }
  }

  getCurrentButton(source: string, content: string) {
    const contentArray = content.split("\n").filter((line) => line !== "");
    const idLine = contentArray.reduce((acc, line, index) => {
      if (source.includes(line)) {
        acc = index + 2;
      }
      return acc;
    }, 0);
    if (!contentArray[idLine] || !contentArray[idLine].includes("^button")) {
      this.errors.push("- Button must have an id");
      return;
    }
    const id = contentArray[idLine].replace("^button-", "");
    const index = buildIndex();
    const currentButton = index.reduce((activeButton, button) => {
      if (button.id === id) {
        activeButton = button;
      }
      return activeButton;
    });
    return currentButton;
  }

  addToSwapCache(button: ButtonCache): SwapCache {
    const buttonIds = button.args.mutations
      .filter((mutation) => {
        return mutation.type === "swap";
      })
      .map((mutation) => {
        const match = mutation.value.match(/\[(.*)\]/);
        const ids = match[1].split(",");
        return ids;
      })
      .flat();
    const buttons = buildIndex().filter((button) => {
      return buttonIds.some((id) => id === button.id);
    });
    const swapButton = {
      id: button.id,
      buttons,
      currentButton: buttons[0],
      currentButtonIndex: 0,
    };
    this.swapCache.push(swapButton);
    return swapButton;
  }

  updateSwapCache(currentSwap: SwapCache) {
    const updatedCache: SwapCache[] = this.swapCache.map((swap) => {
      if (swap.id === currentSwap.id) {
        const newIndex =
          swap.currentButtonIndex === swap.buttons.length
            ? 0
            : swap.currentButtonIndex + 1;
        swap.currentButton = swap.buttons[newIndex];
      }
      return swap;
    });
    this.swapCache = updatedCache;
  }
}
