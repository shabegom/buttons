import { App, Notice } from "obsidian";
import { ButtonCache } from "src/types";
import {buildIndex} from 'src/indexer'
import { removeButtonInCurrentNote as remove } from "src/utils";

const removeMutation = (ids: string, app: App, index: ButtonCache[]) => {
  return () => {
  const buttons = index.filter((button) => ids.includes(button.id)).sort((a,b) => b.position.start.line - a.position.start.line);
    removeIterator(buttons, app);
    buildIndex(app);
  };
};

const removeIterator = async (
  buttons: ButtonCache[],
  app: App,
): Promise<void> => {
  if (buttons.length === 0) {
    return;
  }
  const button = buttons.shift();
  if (button) {
      console.log(`Removing button ${button.id}`);
      remove(app, button.position);
  } else {
    new Notice("The button you are trying to remove does not exist.");
  }
  removeIterator(buttons, app);
};

export default removeMutation;
