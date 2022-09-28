import Buttons from "src/main";
import { Notice, Pos } from "obsidian";
import { ButtonCache } from "src/types";
import { getEditor, wait } from "src/utils";
import { buildIndex } from "../../indexer";

const getCurrentButtonPosition = (id: string) => {
  console.log("getting button position from index");
  const buttons = buildIndex();
  const button = buttons.find((button) => button.id === id);
  return button;
};

const removeMutation = (plugin: Buttons, button: ButtonCache) => {
  const ids = button.args.mutations.find(
    (mutation) => mutation.type === "remove"
  ).value;
  const cleanIds = ids.replace(/\[(.*)\]/, "$1");
  let idArray: string[];
  console.log(cleanIds.includes(","));
  if (cleanIds.includes(",")) {
    idArray = cleanIds.split(",").map((id) => id.trim());
  } else {
    idArray = [cleanIds];
  }

  return () => {
    console.time("remove");
    console.log("building remove buttons index");
    const index = button.inline ? plugin.inlineIndex : plugin.index;
    const buttons = index
      .filter((indexButton) => {
        let match = false;
        idArray.forEach((id) => {
          if (id === indexButton.id && button.file === indexButton.file) {
            match = true;
          }
        });
        return match;
      })
      .sort((a, b) => b.position.start.line - a.position.start.line);
    buttons.forEach((button) => console.log(button));
    removeIterator(plugin, buttons);
    console.timeEnd("remove");
  };
};

const removeButtonInCurrentNote = (position: Pos) => {
  const editor = getEditor();
  editor.refresh();
  const to = position.start.line;
  let from = position.end.line + 2;
  // if they are the same, it's an inline button
  if (position.start.line === position.end.line) {
    from = position.end.line;
  }
  console.log(to, from);
  editor.setSelection({ line: to, ch: 0 }, { line: from, ch: 0 });
  editor.exec("deleteLine");
};

const removeIterator = async (
  plugin: Buttons,
  buttons: ButtonCache[]
): Promise<void> => {
  if (buttons.length === 0) {
    return;
  }
  if (plugin.noteChanged > plugin.cacheChanged) {
    wait(100, removeIterator, [plugin, buttons]);
    return;
  }
  let button = buttons.shift();
  if (button.inline === true) {
    button = plugin.inlineIndex.find(
      (inlineButton) =>
        inlineButton.id === button.id && inlineButton.file === button.file
    );
    button.position = button.inlinePosition;
  } else {
    button = getCurrentButtonPosition(button.id);
  }
  if (button) {
    console.log(`Removing button ${button.id}`);
    removeButtonInCurrentNote(button.position);
  } else {
    new Notice("The button you are trying to remove does not exist.");
  }
  removeIterator(plugin, buttons);
};

export default removeMutation;
