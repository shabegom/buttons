import { App, TFile, CachedMetadata } from "obsidian";
import { ExtendedBlockCache, Arguments } from "./types";
import { createArgumentObject } from "./utils";

interface Action {
  type: string;
  payload: {
    files?: TFile[];
    currentFile?: TFile;
    fileCache?: CachedMetadata;
    button?: Button;
    content?: string;
  };
}

interface State {
  currentFile: TFile | undefined;
  fileCache: CachedMetadata | undefined;
  files: TFile[] | undefined;
  buttons: Button[];
}

interface NewState {
  currentFile?: TFile;
  fileCache?: CachedMetadata;
  files?: TFile[];
  buttons?: Button[];
}

interface Button {
  id: string;
  lineeStart: number;
  lineEnd: number;
  path: string;
  swap: number;
  args: Arguments;
}

const initialState: State = {
  currentFile: undefined,
  fileCache: undefined,
  files: undefined,
  buttons: [],
};

export const store = {
  dispatch: (action: Action): void => {
    store.setState(reducer(store.state, action));
  },
  setState: (newState: NewState): void => {
    store.state = Object.assign({}, { ...store.state, ...newState });
  },
  getState: (): State => store.state,
  state: initialState,
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CURRENT_FILE":
      return action.payload;
    case "SET_FILES":
      return action.payload;
    case "ADD_BUTTONS": {
      const buttonsSet = new Set([
        ...state.buttons,
        ...buildButtonsFromBlockCache(
          action.payload.fileCache,
          action.payload.currentFile,
          action.payload.content
        ),
      ]);
      const buttons = Array.from(buttonsSet);
      return {
        buttons,
      };
    }
    case "UPDATE_BUTTON":
      console.log(action.payload);
      return state;
    case "DELETE_BUTTON":
      console.log(action.payload);
      return state;
    default:
      return state;
  }
};

export const getButtonFromStore = async (
  app: App,
  args: Arguments
): Promise<{ args: Arguments; id: string }> | undefined => {
  const store = store.getState();
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

export const getButtonSwapById = async (id: string): Promise<number> => {
  const { buttons } = store.getState();
  const storedButton = buttons.reduce((acc, button: Button) => {
    if (id === button.id) {
      acc = button;
    }
    return acc;
  });
  console.log(storedButton);
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
    const newStore = new Set([...store, storedButton]);
    localStorage.setItem("buttons", JSON.stringify(newStore));
    buttonStore = Array.from(newStore);
  }
};

export const buildButtonsFromBlockCache = (
  cache: CachedMetadata,
  file: TFile,
  content: string
) => {
  const blocks = cache && cache.blocks;
  if (blocks) {
    const blockKeys = Array.from(Object.keys(blocks));
    const blockArray: ExtendedBlockCache[] = blockKeys
      .map((key) => blocks[key])
      .filter((block) => block.id.includes("button"));
    const buttons = blockArray.reduce((acc, block) => {
      const args = createArgumentObject(
        content
          .split("\n")
          .splice(
            block.position.start.line + 1,
            block.position.end.line - block.position.start.line - 1
          )
          .join("\n")
      );
      const button = {
        id: block.id.split("-")[1],
        lineStart: block.position.start.line,
        lineEnd: block.position.end.line,
        path: file.path,
        swap: 0,
        args,
      };
      return [...acc, button];
    }, []);
    return buttons;
  }
};
