import { registerButtonHandler, registerTemplaterHandler } from "./registry";
import { calculate } from "./calculate";
import { remove } from "./remove";
import { replace } from "./replace";
import { text } from "./text";
import { template } from "./template";
import { link } from "./link";
import { copy } from "./copy";
import { command } from "./command";
import { templater } from "./templater";

// Register all button handlers
export const setupButtonHandlers = () => {
  registerButtonHandler("calculate", calculate);
  registerButtonHandler("remove", remove);
  registerButtonHandler("replace", replace);
  registerButtonHandler("text", text);
  registerButtonHandler("template", template);
  registerButtonHandler("link", link);
  registerButtonHandler("copy", copy);
  registerButtonHandler("command", command);
  registerTemplaterHandler(templater);
}; 