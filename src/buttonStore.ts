import { App, MarkdownView } from "obsidian";

import {
  addIdToButton,
  buttonExists,
  parseButtonById,
  parseButtons,
} from "./parser";
import { Args, Button } from "./types";

export const store = JSON.parse(localStorage.getItem("buttons"));

export const initializeButtonStore = async (app: App): Promise<void> => {
  const files = app.vault.getMarkdownFiles();
  const buttons = files.map(async (file) => {
    const text = await app.vault.read(file);
    return parseButtons(text, file.path);
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
    return store.filter((button: Button) => buttonExists(text, button.id));
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
  files.map(async (file) => {
    const text = await app.vault.read(file);
    const newText = addIdToButton(text, 0);
    await app.vault.modify(file, newText.note);
  });
};

export const getButtonFromStore = async (
  app: App,
  args: Args
): Promise<Button> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const file = activeView.file;
  const size = activeView.editor.lastLine() + 1;
  const text = await app.vault.read(file);
  const parsedButton = args && parseButtonById(text, args.id, file.path);
  if (parsedButton) {
    const store = JSON.parse(localStorage.getItem("buttons"));
    let button = store.filter(
      (storeItem: Button) => storeItem.id === parsedButton.id
    );

    button = button[0]
      ? button.reduce((acc: Button, item: Button) =>
          item.args.parent ? item : acc
        )
      : undefined;
    console.log(button);
    if (button && button.id) {
      cleanButtonStore(app);
      button.args = { ...button.args, ...args };
      return button;
    }
    if (!parsedButton.id) {
      const newNote = addIdToButton(text, size);
      const editor = activeView.editor;
      const oldCursor = editor.getCursor();
      await app.vault.modify(file, `${newNote.note}${newNote.oldValue}`);
      const cursor = editor.getCursor();
      if (oldCursor.line !== cursor.line) {
        cursor.line = cursor.line - 3;
        cursor.ch = cursor.ch + 1;
        editor.setCursor(cursor);
      }
    }
    if (!button && parsedButton.id) {
      addButtonToStore(store, parsedButton);
    }
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
