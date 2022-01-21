import { App, TFile } from "obsidian";
import { ButtonCache } from "./types";
import { createArgs } from "./utils";

const buildIndex = (app: App): ButtonCache[] => {
  console.time("indexer");
  const files = app.vault.getMarkdownFiles();
  const index = files.reduce((acc, file) => {
    const { sections } = app.metadataCache.getFileCache(file);
    if (sections) {
      const buttons = sections.filter(
        (section) => section.id && section.id.includes("button")
      );
      buttons.forEach((button) => {
        acc.push({
          file,
          id: button.id.split("-")[1],
          position: button.position,
        });
      });
    }
    return acc;
  }, []);
  console.timeEnd("indexer");
  console.log(index);
  return index;
};

const buildPageIndex = async (
  app: App,
  file: TFile,
): Promise<ButtonCache[]> => {
  console.time("buildPageIndex");
  const content = await app.vault.read(file);
  const { sections } = app.metadataCache.getFileCache(file);
  if (sections) {
    const code = sections.filter((section) => section.type === "code");
    const pageIndex = code.reduce((acc, codeblock) => {
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
            args,
            button,
            position: codeblock.position,
          });
        }
        return acc;
    }, []);
  console.timeEnd("buildPageIndex");
  return pageIndex;
  }
};

export { buildIndex, buildPageIndex };
