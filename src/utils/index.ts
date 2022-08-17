import createArgs from "./args";
import templater from "./templater";
import { removeButtonInCurrentNote } from "./remove";
import {appendContent} from "./content"

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () =>
    fns.forEach((fn) => fn && fn());

export { appendContent, createArgs, removeButtonInCurrentNote, combine, templater };
