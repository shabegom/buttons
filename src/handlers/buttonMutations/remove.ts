import Buttons from "src/main";
import { App, Notice, Pos } from "obsidian";
import { ButtonCache } from "src/types";
import { getEditor } from "../../utils";

const removeMutation = (plugin: Buttons, ids: string) => {
  return () => {
    const buttons = plugin.index
      .filter((button) => ids.includes(button.id))
      .sort((a, b) => b.position.start.line - a.position.start.line);
    removeIterator(buttons, app);
  };
};

const removeButtonInCurrentNote = (app: App, position: Pos) => {
  const editor = getEditor(app);
  const from = editor.offsetToPos(position.start.offset);
  const to = editor.offsetToPos(position.end.offset);
  editor.setLine(to.line + 1, "");
  editor.replaceRange("", from, to);
};

const removeIterator = async (
  buttons: ButtonCache[],
  app: App
): Promise<void> => {
  if (buttons.length === 0) {
    return;
  }
  const button = buttons.shift();
  if (button) {
    console.log(`Removing button ${button.id}`);
    removeButtonInCurrentNote(app, button.position);
  } else {
    new Notice("The button you are trying to remove does not exist.");
  }
  removeIterator(buttons, app);
};

export default removeMutation;
