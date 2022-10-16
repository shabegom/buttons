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

export const processButtonType = (
  plugin: Buttons,
  button: ButtonCache
): (() => void) => {
  const { type, action } = button.args;
  if (type.includes("template")) {
    return templateButton(plugin, button);
  }
  switch (type) {
    case "command":
      return commandButton(action);
    case "link":
      return linkButton(action);
    default:
      new Notice("No command found");
      return;
  }
};

export const processButtonMutations = (
  plugin: Buttons,
  button: ButtonCache
) => {
  const { mutations } = button.args;
  return mutations.reduce((acc: { (): void }[], mutation) => {
    switch (mutation.type) {
      case "remove":
        acc.push(removeMutation(plugin, button));
        break;
      case "replace":
        acc.push(replaceMutation(mutation.value));
        break;
      case "swap":
        swapMutation;
        acc.push(swapMutation(plugin, button));
    }
    return acc;
  }, []);
};

const createOnclick = (plugin: Buttons, button: ButtonCache) => {
  if (!button.args) {
    return () => {
      new Notice("There is an issue with the button arguments");
    };
  }
  const mutationHandlers = button.args.mutations
    ? processButtonMutations(plugin, button)
    : [];
  const typeHandler = button.args.type && processButtonType(plugin, button);
  if (typeHandler || mutationHandlers.length > 0) {
    const handlerArray = [...mutationHandlers, typeHandler];
    const handlers = combine(...handlerArray);
    return handlers;
  }
  if (!button.args.type) {
    plugin.errors.push("- Button must have a type");
  }
  if (!button.args.action) {
    plugin.errors.push("- Button must have an action");
  }
};

export default createOnclick;
