import createArgs from "./args";
import templater from "./templater";
import {
  removeButtonInCurrentNote,
  replaceButtonInCurrentNote,
} from "./mutations";
import { appendContent, prependContent } from "./content";

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () =>
    fns.forEach((fn) => fn && fn());

export {
  appendContent,
  combine,
  createArgs,
  prependContent,
  removeButtonInCurrentNote,
  replaceButtonInCurrentNote,
  templater,
};
