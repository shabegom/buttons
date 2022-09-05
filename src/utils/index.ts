import createArgs from "./args";
import templater from "./templater";
import {
  appendContent,
  getEditor,
  insertContent,
  prependContent,
  processTemplate,
} from "./content";
import { createNote } from "./note";

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () =>
    fns.forEach((fn) => fn && fn());

function nanoid(num: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export {
  appendContent,
  combine,
  createArgs,
  createNote,
  getEditor,
  insertContent,
  nanoid,
  prependContent,
  processTemplate,
  templater,
};
