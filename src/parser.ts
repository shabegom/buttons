import unified from "unified";
import parse from "remark-parse";
import stringify from "remark-stringify";
import gfm from "remark-gfm";
import visit from "unist-util-visit";
import { map } from "unist-util-map";
import { nanoid } from "nanoid";
import { createArgumentObject } from "./utils";
import { Button, Args, ButtonNode } from "./types";
import { store } from "./buttonStore";

const parser = unified().use(parse).use(gfm);
const markdowner = unified().use(stringify).use(gfm);

export const addButtonToStore = (note: string, path: string): Button[] => {
  const tree = parser.parse(note);
  const buttons: Button[] = [];
  visit(tree, "code", (node: ButtonNode) => {
    if (node.lang === "button") {
      const value: string = node.value;
      const args: Args = createArgumentObject(value);
      const id = args.id ? args.id : nanoid(6);
      store.dispatch({
        type: "ADD_BUTTON",
        payload: {
          start: node.position.start.line,
          end: node.position.end.line,
          args,
          path: path,
          id,
        },
      });
    }
  });
  return buttons;
};

export const addButtonId = (note: string): string => {
  const tree = parser.parse(note);
  const newTree = map(tree, (node: ButtonNode) => {
    if (node.type == "code" && node.lang === "button") {
      const value = node.value;
      const args: Args = createArgumentObject(value);
      const id = args.id ? args.id : nanoid(6);
      const newValue = args.id ? value : value.concat("\n", `id ${id}`);
      return Object.assign({}, node, { value: newValue });
    }
    return node;
  });
  return markdowner.stringify(newTree);
};
