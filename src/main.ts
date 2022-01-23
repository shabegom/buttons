import { MarkdownView, Plugin, TFile, App } from "obsidian";
import { button, buttonPlugin } from "./ui";
import { createArgs } from "./utils";
import { createOnclick } from "./handlers";
import { ButtonCache } from "./types";
import { buildIndex, buildPageIndex } from "./indexer";


export default class Buttons extends Plugin {
  pageIndex: ButtonCache[] = [];
  index: ButtonCache[];
  public  getPageIndex: () => ButtonCache[];

  onload(): void {
    console.log("Buttons loves you");

    this.app.workspace.onLayoutReady(() => {
      this.index = buildIndex(this.app);
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        const { file } = activeView;
        console.log("Buttons: initial page index for ", file.path);
        this.pageIndex = buildPageIndex(
          this.app,
          file,
          this.pageIndex,
          this.index
        );
        this.getPageIndex = getPageIndex(this.app, file, this.pageIndex, this.index).bind(this);
      }
    });

    this.registerEditorExtension(buttonPlugin(this));

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        console.log("metadataCache changed", file.path);
        this.index = buildIndex(this.app);
        this.pageIndex = buildPageIndex(
          this.app,
          file,
          this.pageIndex,
          this.index
        );
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.pageIndex = buildPageIndex(
          this.app,
          file,
          this.pageIndex,
          this.index
        );
        this.getPageIndex = getPageIndex(this.app, file, this.pageIndex, this.index).bind(this);
      })
    );

    this.registerMarkdownCodeBlockProcessor("button", (source, el) => {
      const args = createArgs(source);
      const onClick = createOnclick(args, this.app, this.index);
      button(el, args.name, onClick);
    });
  }
}

const getPageIndex = (app: App, file: TFile , pageIndex: ButtonCache[], index: ButtonCache[]) => () => {
  return buildPageIndex(app, file, pageIndex, index);
}

