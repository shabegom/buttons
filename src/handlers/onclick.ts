import { App, Notice } from "obsidian";
import { Args, ButtonCache } from "../types";
import { combine } from "../utils";

//button types
import {
  commandButton,
  linkButton,
  swapButton,
  templateButton,
} from "./buttonTypes";

//buttons mutations
import { removeMutation } from "./buttonMutations";

const processButtonType = (
  args: Args,
  app: App,
  button: ButtonCache
): (() => void) => {
  const { type, action } = args;
  if (type.includes("template")) {
    return templateButton(action, type, app, button);
  }
  switch (type) {
    case "command":
      return commandButton(action, app);
    case "link":
      return linkButton(action);
    case "swap":
      return swapButton(action);
    default:
      new Notice("No command found");
  }
};

const processButtonMutations = (args: Args, app: App, index: ButtonCache[]) => {
  const { mutations } = args;
  return mutations.reduce((acc: { (): void }[], mutation) => {
    switch (mutation.type) {
      case "remove":
        acc.push(removeMutation(mutation.value, app, index));
    }
    return acc;
  }, []);
};

const createOnclick = (
  args: Args,
  app: App,
  index: ButtonCache[],
  button: ButtonCache
) => {
  const mutationHandlers = args.mutations
    ? processButtonMutations(args, app, index)
    : [];
  const typeHandler = processButtonType(args, app, button);
  const handlerArray = [...mutationHandlers, typeHandler];
  const handlers = combine(...handlerArray);
  return handlers;
};

export default createOnclick;
