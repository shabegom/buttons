import { ButtonCache } from "./types";

const buildIndex = (): ButtonCache[] => {
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
            file: file.path,
            id: codeblock.id.split("-")[1],
            position: codeblock.position,
          });
        });
      }
    }
    return acc;
  }, []);
  console.timeEnd("indexer");
  return index;
};

const addButtonToIndex = (index: ButtonCache[]) => {
  const file = app.workspace.getActiveFile();
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.sections) {
    const { sections } = cache;
    if (sections) {
      const code = sections.filter(
        (section) => section.id && section.id.includes("button")
      );
      const newButton = code.filter((codeblock) => {
        return !index.some(
          (button) => button.id === codeblock.id.split("-")[1]
        );
      });
      newButton.forEach((codeblock) => {
        index.push({
          file: file.path,
          id: codeblock.id.split("-")[1],
          position: codeblock.position,
        });
      });
    }
  }
  return index;
};

export { addButtonToIndex, buildIndex };
