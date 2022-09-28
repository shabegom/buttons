import createArgs from "./args";
import templater, { processTemplate } from "./templater";
import {
  appendContent,
  getEditor,
  insertContent,
  prependContent,
} from "./content";
import { createNote } from "./note";
import {
  getCurrentMode,
  setPreviewMode,
  setSourceMode,
  toggleMode,
} from "./mode";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

// safely handles circular references
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeStringify = (obj: any) => JSON.stringify(obj, getCircularReplacer());

// function to wait before executing a mutation
const wait = (
  ms: number,
  func: (...args: unknown[]) => unknown,
  args: unknown[]
) => {
  console.log("waiting");
  const runFunc = () => func(...(args as []));
  setTimeout(() => {
    runFunc();
  }, ms);
};

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () => {
    for (let i = 0; i <= fns.length; i++) {
      fns[i] && fns[i]();
    }
  };

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
  getCurrentMode,
  getEditor,
  insertContent,
  nanoid,
  prependContent,
  processTemplate,
  safeStringify,
  setPreviewMode,
  setSourceMode,
  templater,
  toggleMode,
  wait,
};
