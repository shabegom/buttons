import createArgs from "./args";
import { removeButtonInCurrentNote } from "./remove";

// function to combine multiple function and output a function
const combine =
  (...fns: { (): void }[]) =>
  () =>
    fns.forEach((fn) => fn && fn());

export { createArgs, removeButtonInCurrentNote, combine };
