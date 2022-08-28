import createArgs from "./args";
import templater from "./templater";
import {
  appendContent,
  getEditor,
  insertContent,
  prependContent,
} from "./content";
import { createNote } from "./note";

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () =>
    fns.forEach((fn) => fn && fn());

export {
  appendContent,
  combine,
  createArgs,
  createNote,
  getEditor,
  insertContent,
  prependContent,
  templater,
};
