import { Notice, Plugin, TFile } from "obsidian";
import buttonPlugin from "./livePreview";
import { createOnclick } from "./handlers";
import { buildIndex } from "./indexer";
import { ButtonCache, Mutation, SwapCache } from "./types";
import { button, ButtonMaker, InlineButton } from "./ui";
import { createArgs, templater } from "./utils";
import showErrorMessage from "./error";

export default class Buttons extends Plugin {
  swapCache: SwapCache[] = [];
  errors: string[] = [];
  index: ButtonCache[] = [];
  inlineIndex: ButtonCache[] = [];
  noteChanged = 0;
  cacheChanged = 0;

  async onload(): Promise<void> {
    console.log("Buttons loves you");
    const storedSwapCache = JSON.parse(localStorage.getItem("swapCache") || "");
    if (storedSwapCache) {
      this.swapCache = storedSwapCache;
    }

    this.registerEditorExtension([buttonPlugin(this)]);

    this.registerEvent(
      app.workspace.on("file-open", () => {
        this.index = buildIndex();
      })
    );

    this.registerEvent(
      app.metadataCache.on(
        "changed",
        () => (this.cacheChanged = new Date().getTime())
      )
    );

    this.addCommand({
      id: "button-maker",
      name: "Button Maker",
      callback: () => new ButtonMaker(app).open(),
    });

    this.registerMarkdownCodeBlockProcessor(
      "button",
      async (source, el, ctx): Promise<void> => {
        this.errors = [];
        const sectionInfo = ctx.getSectionInfo(el);
        if (source.includes("<%")) {
          const runTemplater = await templater();
          if (runTemplater) {
            source = await runTemplater(source);
          }
        }
        // slice the note content to grab the button block id
        const content = sectionInfo?.text
          .split("\n")
          .slice(sectionInfo.lineEnd + 1, sectionInfo.lineEnd + 2)
          .join("\n");
        const currentButton = this.getCurrentButton(content || "");
        const args = createArgs(source);
        if (!args.name) {
          args.name = "Give me a name please";
        }
        if (currentButton) {
          currentButton.args = args;
          const onClick =
            createOnclick(this, currentButton) ||
            (() => new Notice("Button click failed"));
          if (this.errors.length === 0) {
            button(
              el,
              currentButton?.args?.name || "",
              onClick,
              currentButton.args.class || "",
              currentButton.args.color || ""
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
      const sectionInfo = ctx.getSectionInfo(el);
      const lineStart = sectionInfo?.lineStart;
      for (let index = 0; index < codeBlocks.length; index++) {
        const codeBlock = codeBlocks[index];
        const code = codeBlock.innerText;
        const match = code.match(/button-([\d\w]{1,6})/);
        if (match && lineStart) {
          const id = match[1];
          const indexedButton = await this.getInlineButton(id, lineStart);
          if (indexedButton) {
            const onClick =
              createOnclick(this, indexedButton) ||
              (() => new Notice("Button click failed"));
            ctx.addChild(
              new InlineButton(
                codeBlock,
                indexedButton.args.name || "",
                onClick,
                indexedButton.args.class || "",
                indexedButton.args.color || ""
              )
            );
          }
        }
      }
    });
  }

  buildInlineIndex(inlineButton: ButtonCache) {
    const newInlineIndex = this.inlineIndex.reduce(
      (acc: ButtonCache[], button: ButtonCache) => {
        if (!button) {
          return acc;
        }
        if (
          inlineButton.id === button.id &&
          inlineButton.file === button.file &&
          inlineButton.position.start.line === button.position.start.line
        ) {
          acc.push(inlineButton);
          return acc;
        }
        acc.push(button);
        return acc;
      },
      []
    );
    this.inlineIndex = newInlineIndex;
    if (
      !this.inlineIndex.find(
        (button) =>
          inlineButton.id === button.id &&
          inlineButton.file === button.file &&
          inlineButton.position.start.line === button.position.start.line
      )
    ) {
      this.inlineIndex.push(inlineButton);
    }
  }

  async getInlineButton(id: string, line: number) {
    const indexedButton = this.findButtonFromIndex(id);
    if (indexedButton && indexedButton.file) {
      const file = app.vault.getAbstractFileByPath(indexedButton.file) as TFile;

      if (file) {
        const content = await app.vault.read(file);
        let codeblock = content
          .split("\n")
          .reduce((acc: string[], line, index) => {
            if (
              index >= indexedButton.position.start.line - 1 &&
              index <= indexedButton.position.end.line + 1 &&
              !line.includes("`")
            ) {
              acc.push(line);
            }
            return acc;
          }, [])
          .join("\n");
        if (codeblock.includes("<%")) {
          const runTemplater = await templater();
          if (runTemplater) {
            codeblock = await runTemplater(codeblock);
          }
        }
        const inlinePosition = {
          start: { line: line - 1, col: 0, offset: 0 },
          end: { line: line - 1, col: 0, offset: 0 },
        };
        const args = createArgs(codeblock);
        const inlineButton = {
          inline: true,
          id,
          file: file.path,
          args,
          position: indexedButton.position,
          inlinePosition,
        };
        console.log(inlineButton);
        this.buildInlineIndex(inlineButton);
        return inlineButton;
      }
    }
  }

  getActiveButton(index: ButtonCache[], id: string) {
    return index.find((button) => button.id === id);
  }

  findButtonFromIndex(id: string) {
    let activeButton: ButtonCache;
    activeButton = this.getActiveButton(this.index, id);
    if (!activeButton) {
      this.index = buildIndex();
      activeButton = this.getActiveButton(this.index, id);
    }
    if (activeButton) {
      return {
        id: activeButton.id,
        position: activeButton.position,
        args: activeButton.args,
        file: activeButton.file,
      };
    }
  }

  getCurrentButton(content: string) {
    if (!content.includes("^button")) {
      this.errors.push("- Button must have an id");
      return;
    }
    const id = content.replace("^button-", "");
    const currentButton = this.findButtonFromIndex(id);
    return currentButton;
  }

  addToSwapCache(button: ButtonCache): void {
    const buttonIds = button?.args?.mutations
      ?.filter((mutation: Mutation) => {
        return mutation.type === "swap";
      })
      .map((mutation) => {
        const match = mutation.value.match(/\[(.*)\]/);
        const ids = match ? match[1].replace(" ", "").split(",") : [];
        return ids;
      })
      .flat();
    const buttons = this.index
      .filter((button) => {
        return buttonIds?.some((id) => id === button.id);
      })
      .map(async (button) => {
        const inlineButton = await this.getInlineButton(
          button.id,
          button.position.start.line
        );
        if (inlineButton) {
          inlineButton.file = button.file || "";
          inlineButton.position = button.position;
          return inlineButton;
        }
      });
    Promise.all(buttons).then((buttons) => {
      const swapButton = {
        id: button.id,
        position: button.position,
        buttons,
        currentButtonIndex: 0,
      };
      this.swapCache.push(swapButton as SwapCache);
    });
    localStorage.setItem("swapCache", JSON.stringify(this.swapCache));
  }

  updateSwapCache(currentSwap: SwapCache) {
    const updatedCache: SwapCache[] = this.swapCache.map((swap) => {
      if (swap.id === currentSwap.id) {
        swap.currentButtonIndex =
          swap.currentButtonIndex === swap.buttons.length - 1
            ? 0
            : swap.currentButtonIndex + 1;
      }
      return swap;
    });
    this.swapCache = updatedCache;
    localStorage.setItem("swapCache", JSON.stringify(this.swapCache));
  }
}
