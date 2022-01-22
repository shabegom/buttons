import { App, TFile } from "obsidian";
import { ButtonCache } from "./types";
import { createArgs } from "./utils";

const buildIndex = (app: App): ButtonCache[] => {
  console.time("indexer");
  const files = app.vault.getMarkdownFiles();
  const index = files.reduce((acc, file) => {
    const cache = app.metadataCache.getFileCache(file);
    if (cache) {
      const { sections } = cache;
      if (sections) {
        const code = sections.filter(
          (section) => section.id && section.id.includes("button")
        );
        app.vault.read(file).then((content) => {
          code.forEach((codeblock) => {
            const button = content.substring(
              codeblock.position.start.offset,
              codeblock.position.end.offset
            );
            if (button.includes("button")) {
              const buttonArr = button.split("\n");
              buttonArr.shift();
              buttonArr.pop();
              const args = createArgs(buttonArr.join("\n"));
              acc.push({
                file,
                args,
                id: codeblock.id.split("-")[1],
                button,
                position: codeblock.position,
              });
            }
          });
        });
      }
    }
    return acc;
  }, []);
  console.timeEnd("indexer");
  console.log(index);
  return index;
};

const buildPageIndex = (app: App, file: TFile): ButtonCache[] => {
  console.time("buildPageIndex");
  const buttons: ButtonCache[] = [];
  const { sections } = app.metadataCache.getFileCache(file);
  const code = sections.filter(
    (section) => section.id && section.id.includes("button")
  );
  if (sections) {
    app.vault.read(file).then((content) => {
      code.forEach((codeblock) => {
        const button = content.substring(
          codeblock.position.start.offset,
          codeblock.position.end.offset
        );
        if (button.includes("button")) {
          const buttonArr = button.split("\n");
          buttonArr.shift();
          buttonArr.pop();
          const args = createArgs(buttonArr.join("\n"));
          buttons.push({
            file,
            args,
            id: codeblock.id.split("-")[1],
            button,
            position: codeblock.position,
          });
        }
      });
    });
    console.timeEnd("buildPageIndex");
    return buttons;
  }
};

export { buildIndex, buildPageIndex };
