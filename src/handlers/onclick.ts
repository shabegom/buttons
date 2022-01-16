import {App, Notice} from 'obsidian'
import {Args} from "../types";

//button types
import commandButton from './buttonTypes/command';
import linkButton from './buttonTypes/link';

const createOnclick = (args: Args, app: App) => {
  const {type, action} = args;
  switch (type) {
    case "command":
      return commandButton(action, app);
    case "link":
      return linkButton(action)
    default:
      return () => new Notice("No command found");
  }
}

export default createOnclick;
