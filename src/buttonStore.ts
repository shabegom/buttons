import { App, TFile, CachedMetadata } from "obsidian";
import { ExtendedBlockCache, Arguments } from "./types";
import { createArgumentObject } from "./utils";

let buttonStore: ExtendedBlockCache[];

export const initializeButtonStore = (app: App): void => {
  const files = app.vault.getMarkdownFiles();
  const blocksArr = files
    .map((file) => {
      const cache = app.metadataCache.getFileCache(file);
      return buildButtonArray(cache, file);
    })
    .filter((arr) => arr !== undefined)
    .flat();
  localStorage.setItem("buttons", JSON.stringify(blocksArr));
  buttonStore = blocksArr;
};

export const addButtonToStore = (app: App, file: TFile): void => {
  const cache = app.metadataCache.getFileCache(file);
  const buttons = buildButtonArray(cache, file);
  const store = JSON.parse(localStorage.getItem("buttons"));
  const newStore = buttons
    ? removeDuplicates([...buttons, ...store])
    : removeDuplicates(store);
  localStorage.setItem("buttons", JSON.stringify(newStore));
  buttonStore = newStore;
};

export const getButtonFromStore = async (
  app: App,
  args: Arguments
): Promise<Arguments> | undefined => {
  let store = JSON.parse(localStorage.getItem("buttons"));
  store = store ? store : buttonStore;
  if (args.id) {
    const storedButton = store.filter(
      (item: ExtendedBlockCache) => `button-${args.id}` === item.id
    )[0];
    if (storedButton) {
      const file = app.vault.getAbstractFileByPath(storedButton.path);
      const content = await app.vault.cachedRead(file as TFile);
      const contentArray = content.split("\n");
      const button = contentArray
        .slice(
          storedButton.position.start.line + 1,
          storedButton.position.end.line
        )
        .join("\n");
      const storedArgs = createArgumentObject(button);
      return { ...storedArgs, ...args };
    }
  }
};

export const buildButtonArray = (
  cache: CachedMetadata,
  file: TFile
): ExtendedBlockCache[] => {
  const blocks = cache.blocks;
  if (blocks) {
    const blockKeys = Array.from(Object.keys(blocks));
    const blockArray: ExtendedBlockCache[] = blockKeys
      .map((key) => blocks[key])
      .map((obj: ExtendedBlockCache) => {
        obj["path"] = file.path;
        return obj;
      })
      .filter((block) => block.id.includes("button"));
    return blockArray;
  }
};

function removeDuplicates(arr: ExtendedBlockCache[]) {
  return arr
    ? arr.filter(
        (v, i, a) =>
          a.findIndex(
            (t) =>
              t.id === v.id ||
              (t.path === v.path &&
                t.position.start.line === v.position.start.line &&
                t.position.end.line === v.position.end.line)
          ) === i
      )
    : arr;
}
