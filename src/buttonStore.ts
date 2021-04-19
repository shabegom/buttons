import { App, MarkdownView } from "obsidian";
import { parseButtons, addIdToButton } from "./parser";
import { Button, Args } from "./types";

export const createButtonStore = async (app: App): Promise<void> => {
  const files = app.vault.getMarkdownFiles();
  const buttons = files.map(async (file) => {
    const text = await app.vault.read(file);
    return parseButtons(text, file.path);
  });
  const buttonStore = await Promise.all(buttons).then((result) =>
    result.filter((arr) => arr[0]).flat()
  );
  localStorage.setItem(
    "buttons",
    JSON.stringify(removeDuplicates(buttonStore))
  );
};

export const addIdsToButtons = async (app: App): Promise<void> => {
  const files = app.vault.getMarkdownFiles();
  files.map(async (file) => {
    const text = await app.vault.read(file);
    const newText = addIdToButton(text);
    await app.vault.modify(file, newText);
  });
};

export const getButtonFromStore = async (
  app: App,
  args: Args
): Promise<Button> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const file = activeView.file;
  const text = await app.vault.read(file);
  const buttons = parseButtons(text, file.path);
  const store = JSON.parse(localStorage.getItem("buttons"));
  const buttonFromArgs = buttons.filter(
    (button: Button) => button.args.id === args.id
  )[0];
  let button;
  if (buttonFromArgs) {
    button = store.reverse().reduce((obj: Button, item: Button) => {
      if (buttonFromArgs.id === item.id) {
        obj = item;
        obj.args = { ...item.args, ...args };
      }
      return obj;
    }, {});
  }

  if (button && button.id) {
    return button;
  } else if (buttonFromArgs) {
    addIdsToButtons(app);
    createButtonStore(app);
  }
};

export async function addButtonToStore(store: Button[], button: Button) {
  console.log("adding button to store");
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

function combineButtons(buttons: Button[]) {
  return buttons.reduce((acc, button) => {
    if (acc[0]) {
      const combined = acc.reduce((obj, item, index) => {
        if (item.id === button.id) {
          const args = button.args.name ? button.args : item.args;
          obj = {
            id: item.id,
            start: [item.start, ...button.start],
            end: [...item.end, ...button.end],
            args,
            path: [...item.path, ...button.path],
            count: item.count ? item.count++ : 2,
          };
        }
        return { index, obj };
      }, {});
      if (combined.obj.id) {
        acc[combined.index] = combined.obj;
      } else {
        acc.push(button);
      }
    } else {
      acc.push(button);
    }
    return acc;
  }, []);
}
