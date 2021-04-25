import { App, Vault, MarkdownView, TFile } from "obsidian";

import {
  getButtonById,
  getButtonWithoutId,
  getButtonsFromNote,
} from "./parser";
import { Args, Button } from "./types";

export const store = JSON.parse(localStorage.getItem("buttons"));

export const initializeButtonStore = async (app: App): Promise<void> => {
  const files = app.vault.getMarkdownFiles();
  const buttons = files.map(async (file) => {
    const text = await app.vault.read(file);
    return getButtonsFromNote(text, file.path).map((obj) => obj.button);
  });
  const buttonStore = removeDuplicates(
    await Promise.all(buttons).then((result) =>
      result
        .filter((arr) => arr[0])
        .flat()
        .map((button, i) => {
          button.index = i;
          return button;
        })
    )
  );
  localStorage.setItem("buttons", JSON.stringify(buttonStore));
};

export const cleanButtonStore = async (app: App): Promise<void> => {
  const store = JSON.parse(localStorage.getItem("buttons"));
  const files = app.vault.getMarkdownFiles();
  const buttons = files.map(async (file) => {
    const text = await app.vault.read(file);
    return store.filter((button: Button) =>
      getButtonById(text, button.id, file.path)
    );
  });
  const cleanedStore = removeDuplicates(
    await Promise.all(buttons).then((result) =>
      result
        .filter((arr) => arr[0])
        .flat()
        .map((button, i) => {
          button.index = i;
          return button;
        })
    )
  );
  localStorage.setItem("buttons", JSON.stringify(cleanedStore));
};

export const addIdsToButtons = async (app: App): Promise<void> => {
  const files = app.vault.getMarkdownFiles();
  for (let i = 0; i < files.length; i++) {
    const text = await app.vault.read(files[i]);
    const buttons = getButtonsFromNote(text, files[i].path);
    for (let j = 0; j < buttons.length; j++) {
      if (!buttons[j].hasId) {
        writeInactiveViewButtonId(app.vault, files[i], buttons[j].button);
      }
    }
  }
};

const addIdToButton = async (app: App): Promise<Button> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const file = activeView.file;
  const text = await app.vault.read(file);
  const path = file.path;
  const button = getButtonWithoutId(text, path);
  if (button) {
    await writeButtonId(button, app);
    return button;
  }
};

const writeInactiveViewButtonId = async (
  vault: Vault,
  file: TFile,
  button: Button
) => {
  const text = await vault.read(file);
  const textArray = text.split("\n");
  const buttonPosStart = button.start;
  const buttonPosEnd = button.end;
  textArray.splice(buttonPosStart - 1, buttonPosEnd - 1, button.buttonString);
  await vault.modify(file, textArray.join("\n"));
};

const writeButtonId = async (button: Button, app: App): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const text = await app.vault.read(file);
    const textArray = text.split("\n");
    const buttonPosStart = button.start;
    const buttonPosEnd = button.end;
    const findClosedButton = text.match(
      /\`{3}button\n([\w\d()/,\n\s]*)\`{3}(.*+)?/gm
    );
    const findOpenButton = text.match(/\`{3}button([a-zA-Z0-9\ns]*)[^\`{3}]/g);

    textArray.splice(buttonPosStart - 1, buttonPosEnd - 1, button.buttonString);
    console.log("closed: ", findClosedButton);
    console.log("open: ", findOpenButton);
    if (findClosedButton && findClosedButton[1]) {
      textArray.push(findClosedButton[2]);
    }
    if (findOpenButton && findOpenButton[1]) {
      textArray.push(findOpenButton[1]);
    }
    app.vault.modify(file, textArray.join("\n"));
  } else {
    addIdsToButtons(app);
  }
};

export const getButtonFromStore = async (
  app: App,
  args: Args
): Promise<Button> => {
  const store = JSON.parse(localStorage.getItem("buttons"));
  const file = app.workspace.getActiveViewOfType(MarkdownView).file;
  const text = await app.vault.read(file);
  const path = file.path;
  if (args.id) {
    let button = store.filter((storeItem: Button) => storeItem.id === args.id);
    if (button[0]) {
      button = button.reduce((acc: Button, item: Button) =>
        item.args.parent ? item : acc
      );
      cleanButtonStore(app);
      button.args = { ...button.args, ...args };
      return button;
    } else {
      button = getButtonById(text, args.id, path);
      if (button) {
        addButtonToStore(store, button);
      }
    }
  } else {
    await addIdToButton(app);
  }
};

export async function addButtonToStore(
  store: Button[],
  button: Button
): Promise<void> {
  const updatedStore = removeDuplicates([button, ...store]);
  localStorage.setItem("buttons", JSON.stringify(updatedStore));
}

function removeDuplicates(arr: Button[]) {
  return arr.filter(
    (v, i, a) =>
      a.findIndex(
        (t) => t.path === v.path && t.start === v.start && t.end === v.end
      ) === i
  );
}

async function updateCursorPostion(app: App): Promise<void> {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = activeView.editor;
  const oldCursor = editor.getCursor();
  const cursor = editor.getCursor();
  if (oldCursor.line !== cursor.line) {
    cursor.line = cursor.line - 3;
    cursor.ch = cursor.ch + 1;
    editor.setCursor(cursor);
  }
}
