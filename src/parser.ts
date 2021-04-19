import unified from "unified";
import parse from "remark-parse";
import stringify from "remark-stringify";
import gfm from "remark-gfm";
import visit from "unist-util-visit";
import { map } from "unist-util-map";
import { nanoid } from "nanoid";
import { createArgumentObject } from "./utils";
import { Node } from "unist";
import { Button, Args, ButtonNode } from "./types";

const parser = unified().use(parse).use(gfm);

export const returnMD = (tree: Node): string => {
  return unified().use(stringify).use(gfm).stringify(tree);
};

export const parseNote = (note: string): Node => {
  console.log("parsing note: ", note);
  return parser.parse(note);
};

export const parseButtons = (note: string, path: string): Button[] => {
  const tree = parser.parse(note);
  const buttons: Button[] = [];
  visit(tree, "code", (node: ButtonNode) => {
    if (node.lang === "button") {
      const value: string = node.value;
      const args: Args = createArgumentObject(value);
      const id = args.id ? args.id : nanoid(6);
      buttons.push({
        start: node.position.start.line,
        end: node.position.end.line,
        args,
        path: path,
        id,
      });
    }
  });
  return buttons;
};

export const removeButton = (tree: Node, id: string): Node => {
  visit(tree, "code", function (node: ButtonNode, index, parent) {
    if (node.lang === "button") {
      if (node.value.includes(id)) {
        parent.children.splice(index, 1);
      }
    }
    // Do not traverse `node`, continue at the node *now* at `index`.
    return [visit.SKIP, index];
  });
  return tree;
};

export const addIdToButton = (note): string => {
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
  return returnMD(newTree);
};
