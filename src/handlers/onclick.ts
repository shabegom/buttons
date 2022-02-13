import { App, Notice } from "obsidian";
import { Args, ButtonCache } from "../types";
import { combine } from "../utils";

//button types
import { commandButton, linkButton } from "./buttonTypes";

//buttons mutations
import { removeMutation } from "./buttonMutations";

const processButtonType = (type: string, action: string, app: App) => {
  switch (type) {
    case "command":
      return commandButton(action, app);
    case "link":
      return linkButton(action);
    default:
      return () => new Notice("No command found");
  }
};

const processButtonMutations = (
  mutations: Args["mutations"],
  app: App,
  index: ButtonCache[]
) => {
  return mutations.reduce((acc: { (): void }[], mutation) => {
    switch (mutation.type) {
      case "remove":
        acc.push(removeMutation(mutation.value, app, index));
    }
    return acc;
  }, []);
};

const createOnclick = (args: Args, app: App, index: ButtonCache[]) => {
  const { type, action, mutations } = args;
  const typeHandler = processButtonType(type, action, app);
  const mutationHandlers = mutations
    ? processButtonMutations(mutations, app, index)
    : [];
  const handlerArray = [...mutationHandlers, typeHandler];
  const handlers = combine(...handlerArray);
  return handlers;
};

export default createOnclick;
