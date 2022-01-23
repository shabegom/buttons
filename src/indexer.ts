import { App  } from "obsidian";
import { ButtonCache } from "./types";

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



export { buildIndex };
