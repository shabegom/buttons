import { App, TFile, CachedMetadata, Events } from "obsidian";
import { ExtendedBlockCache, Arguments } from "./types";
import { createArgumentObject } from "./utils";

let buttonStore: ExtendedBlockCache[];

export const getStore = (isMobile: boolean): ExtendedBlockCache[] =>
  isMobile ? buttonStore : JSON.parse(localStorage.getItem("buttons"));

export const initializeButtonStore = (app: App, storeEvents: Events): void => {
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
  storeEvents.trigger('index-complete')
};

export const addButtonToStore = (app: App, file: TFile): void => {
  const cache = app.metadataCache.getFileCache(file);
  const buttons = buildButtonArray(cache, file);
  const store = getStore(app.isMobile);
  const newStore =
    buttons && store
      ? removeDuplicates([...buttons, ...store])
      : store
      ? removeDuplicates(store)
      : buttons
      ? removeDuplicates(buttons)
      : [];
  localStorage.setItem("buttons", JSON.stringify(newStore));
  buttonStore = newStore;
};

export const getButtonFromStore = async (
  app: App,
  args: Arguments
): Promise<{ args: Arguments; id: string }> | undefined => {
  const store = getStore(app.isMobile);
  args.id;
  if (args.id) {
    const storedButton =
      store &&
      store.filter(
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
      return {
        args: { ...storedArgs, ...args },
        id: storedButton.id.split("button-")[1],
      };
    }
  }
};

export const getButtonById = async (
  app: App,
  id: string
): Promise<Arguments> => {
  const store = getStore(app.isMobile);
  const storedButton = store.filter(
    (item: ExtendedBlockCache) => `button-${id}` === item.id
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
    return createArgumentObject(button);
  }
};

export const getButtonSwapById = async (
  app: App,
  id: string
): Promise<number> => {
  const store = getStore(app.isMobile);
  const storedButton = store.filter(
    (item: ExtendedBlockCache) => `button-${id}` === item.id
  )[0];
  if (storedButton) {
    return storedButton.swap;
  }
};

export const setButtonSwapById = async (
  app: App,
  id: string,
  newSwap: number
): Promise<void> => {
  const store = getStore(app.isMobile);
  const storedButton = store.filter(
    (item: ExtendedBlockCache) => `button-${id}` === item.id
  )[0];
  if (storedButton) {
    storedButton.swap = newSwap;
    const newStore = removeDuplicates([...store, storedButton]);
    localStorage.setItem("buttons", JSON.stringify(newStore));
    buttonStore = newStore;
  }
};

export const buildButtonArray = (
  cache: CachedMetadata,
  file: TFile
): ExtendedBlockCache[] => {
  const blocks = cache && cache.blocks;
  if (blocks) {
    const blockKeys = Array.from(Object.keys(blocks));
    const blockArray: ExtendedBlockCache[] = blockKeys
      .map((key) => blocks[key])
      .map((obj: ExtendedBlockCache) => {
        obj["path"] = file.path;
        obj["swap"] = 0;
        return obj;
      })
      .filter((block) => block.id.includes("button"));
    return blockArray;
  }
};

function removeDuplicates(arr: ExtendedBlockCache[]) {
  return arr && arr[0]
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
