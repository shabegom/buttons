import { nanoid } from "nanoid";
import gfm from "remark-gfm";
import parse from "remark-parse";
import stringify from "remark-stringify";
import unified from "unified";
import { Node } from "unist";
import { map } from "unist-util-map";
import visit from "unist-util-visit";

import { Args, Button, ButtonNode } from "./types";
import { createArgumentObject } from "./utils";

const parser = unified().use(parse).use(gfm);

export const returnMD = (tree: Node): string => {
  return unified().use(stringify).use(gfm).stringify(tree);
};

export const parseNote = (note: string): Node => {
  return parser.parse(note);
};

export const parseButtons = (note: string, path: string): Button[] => {
  const tree = parser.parse(note);
  const buttons: Button[] = [];
  visit(tree, "code", (node: ButtonNode) => {
    if (node.lang === "button") {
      const value: string = node.value;
      const args: Args = createArgumentObject(value);
      args.id = args.id ? args.id : nanoid(6);
      const buttonObject = createButtonObject(node, args, path);
      buttons.push(buttonObject);
    }
  });
  return buttons;
};

export const buttonExists = (note: string, buttonId: string): boolean => {
  const tree = parser.parse(note);
  let button = false;
  buttonVisitor(tree, (_, args) => {
    if (args.id == buttonId) {
      button = true;
    }
  });
  return button;
};

export const parseButtonById = (
  note: string,
  buttonId: string,
  path: string
): Button => {
  const tree = parser.parse(note);
  let button = undefined;
  buttonVisitor(tree, (node, args) => {
    if (args.id == buttonId) {
      button = createButtonObject(node, args, path);
    }
  });
  return button;
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

export const addIdToButton = (
  note: string,
  size: number
): { note: string; oldValue: string } => {
  const tree = parser.parse(note);
  let oldValue = "";
  const newTree = map(tree, (node: ButtonNode) => {
    if (node.type == "code" && node.lang === "button") {
      const value = node.value;
      const args: Args = createArgumentObject(value);
      const id = args.id ? args.id : nanoid(6);
      let newValue = "";
      if (args.name) {
        newValue += `\nname ${args.name}`;
      }
      if (args.type) {
        newValue += `\ntype ${args.type}`;
      }
      if (args.action) {
        newValue += `\naction ${args.action}`;
      }
      if (args.color) {
        newValue += `\ncolor ${args.color}`;
      }
      if (args.class) {
        newValue += `\nclass ${args.class}`;
      }
      if (args.remove) {
        newValue += `\nremove ${args.remove}`;
      }
      if (args.replace) {
        typeof args.replace === "string"
          ? (newValue += `\nreplace ${args.replace}`)
          : (newValue += `\nreplace ${args.replace.join(" ")}`);
      }
      if (args.parent) {
        newValue += `\nparent ${args.parent.toString()}`;
      }
      if (!args.id) {
        newValue += `\nid ${id}`;
      } else {
        newValue = value;
      }
      console.log(newValue.split("\n").filter((item) => item));
      const newCodeNode = Object.assign({}, node, {
        value: newValue
          .split("\n")
          .filter((item) => item)
          .join("\n"),
      });
      const nodeEnd = node.position.end.line + 1;
      if (nodeEnd === size) {
        oldValue = value;
      }
      return newCodeNode;
    }
    return node;
  });
  return { note: returnMD(newTree), oldValue };
};

const buttonVisitor = (
  tree: Node,
  transform: (node: ButtonNode, args: Args) => void
) => {
  visit(tree, "code", (node: ButtonNode) => {
    if (node.lang === "button") {
      const args = createArgumentObject(node.value);
      transform(node, args);
    }
  });
};

const createButtonObject = (
  node: ButtonNode,
  args: Args,
  path: string
): Button => {
  return {
    start: node.position.start.line + 1,
    end: node.position.end.line + 1,
    args,
    path,
    id: args.id,
  };
};
