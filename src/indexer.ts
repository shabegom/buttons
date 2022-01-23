import { App, TFile } from "obsidian";
import { ButtonCache } from "./types";
import { createArgs } from "./utils";

const buildIndex = (app: App): ButtonCache[] => {
  console.time("indexer");
  const files = app.vault.getMarkdownFiles();
  const index = files.reduce((acc, file) => {
    const cache = app.metadataCache.getFileCache(file);
    if (cache && cache.sections) {
      const { sections } = cache;
      if (sections) {
        const code = sections.filter(
          (section) => section.id && section.id.includes("button")
        );
        code.forEach((codeblock) => {
          acc.push({
            file,
            id: codeblock.id.split("-")[1],
            position: codeblock.position,
          });
        })
      }
    }
    return acc;
  }, []);
  console.timeEnd("indexer");
  console.log(index);
  return index;
};

const buildPageIndex = (app: App, file: TFile, pageIndex: ButtonCache[],vaultIndex: ButtonCache[]): ButtonCache[] => {
  console.time("buildPageIndex");
  const index = [file].reduce((acc, file) => {
    if (!acc[0] && pageIndex.length > 0) {
      acc = pageIndex
    }
    const cache = app.metadataCache.getFileCache(file);
    if (cache && cache.sections) {
      const { sections } = app.metadataCache.getFileCache(file);
      const code = sections.filter(
        (section) => section.id && section.id.includes("button")
      );
      if (sections) {
        app.vault.read(file).then((content) => {
          code.forEach((codeblock) => {
            const id = codeblock.id.split("-")[1];
            if (pageIndex.find((button) => button.id === id)) {
              return;
            }
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
                id,
                button,
                position: codeblock.position,
              });
            }
          });
          content.split("\n").forEach(line => {
            if (line.includes("button")) {
              const ids = line.match(/button-[\d\w]{1,6}/g);
            if (ids) {
              ids.forEach(id => {
                id = id.split("-")[1];
                if (pageIndex.find((button) => button.id === id)) {
                  return;
                }
                const button = vaultIndex.find((button) => button.id === id);
                if (button) {
                buildPageIndex(app, button.file, acc, vaultIndex);
                }
              });
            }
            }
          })
        });
      }
    }
    return acc;
  }, []);
  console.log(index);
  console.timeEnd("buildPageIndex");
  return index;
};

export { buildIndex, buildPageIndex };
