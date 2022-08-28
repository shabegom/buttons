import { Notice } from "obsidian";
import { ButtonCache } from "src/types";
import { combine } from "../utils";
import Buttons from "src/main";

//button types
import { commandButton, linkButton, templateButton } from "./buttonTypes";

//buttons mutations
import {
  removeMutation,
  replaceMutation,
  swapMutation,
} from "./buttonMutations";

const processButtonType = (button: ButtonCache): (() => void) => {
  const { type, action } = button.args;
  if (type.includes("template")) {
    return templateButton(button);
  }
  switch (type) {
    case "command":
      return commandButton(action);
    case "link":
      return linkButton(action);
    default:
      new Notice("No command found");
  }
};

const processButtonMutations = (plugin: Buttons, button: ButtonCache) => {
  const { mutations } = button.args;
  return mutations.reduce((acc: { (): void }[], mutation) => {
    switch (mutation.type) {
      case "remove":
        acc.push(removeMutation(plugin, mutation.value));
        break;
      case "replace":
        acc.push(replaceMutation(mutation.value));
        break;
      case "swap":
        acc.push(swapMutation(plugin, button));
    }
    return acc;
  }, []);
};

const createOnclick = (plugin: Buttons, button: ButtonCache) => {
  const mutationHandlers = button.args.mutations
    ? processButtonMutations(plugin, button)
    : [];
  const typeHandler = processButtonType(button);
  const handlerArray = [...mutationHandlers, typeHandler];
  const handlers = combine(...handlerArray);
  return handlers;
};

export default createOnclick;
