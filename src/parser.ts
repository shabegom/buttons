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

const parser = unified()
  .use(parse)
  .use(gfm);

export const returnMD = (tree: Node): string => {
  return unified()
    .use(stringify)
    .use(gfm)
    .stringify(tree);
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
  buttonVisitor(tree, (node, args) => {
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
  visit(tree, "code", function(node: ButtonNode, index, parent) {
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

export const addIdToButton = (note: string, size: number): string => {
  const tree = parser.parse(note);
  let oldValue: string;
  let newTree = map(tree, (node: ButtonNode) => {
    if (node.type == "code" && node.lang === "button") {
      const value = node.value;
      const args: Args = createArgumentObject(value);
      const id = args.id ? args.id : nanoid(6);
      const newValue = args.id ? value : `id ${id}`;
      const newCodeNode = Object.assign({}, node, { value: newValue });
      const nodeEnd = node.position.end.line + 1;
      if (nodeEnd === size) {
        oldValue = Object.assign(
          {},
          {
            type: "text",
            value,
            position: {
              start: { line: node.position.end.line, column: 0, offset: 0 },
              end: { line: size, column: 0, offset: 0 }
            }
          }
        );
      }
      return newCodeNode;
    }
    return node;
  });
  let newNewTree;
  if (oldValue) {
    newNewTree = map(newTree, (node: Node) => {
      if (node.type == "root") {
        const newChildren = [...node.children, oldValue];
        return Object.assign({}, node, { children: newChildren });
      }
      return node;
    });
  }
  console.log(newNewTree);
  return newNewTree ? returnMD(newNewTree) : returnMD(newTree);
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
    id: args.id
  };
};
