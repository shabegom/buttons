import { nanoid } from "nanoid";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import footnotes from "remark-footnotes";
import parse from "remark-parse";
import unified from "unified";
import { Node } from "unist";
import visit from "unist-util-visit";

import { Args, Button, ButtonNode, TextNode } from "./types";
import { createArgumentObject } from "./utils";

const parser = unified()
  .use(parse)
  .use(gfm)
  .use(frontmatter, [{ type: "yaml", marker: "-" }])
  .use(footnotes);

export const getButtonById = (
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

export const getButtonWithoutId = (note: string, path: string): Button => {
  const tree = parser.parse(note);
  let button = undefined;
  buttonVisitor(tree, (node, args) => {
    if (!args.id) {
      button = createButtonObject(node, args, path);
    }
  });
  return button;
};

export const getButtonsFromNote = (text: string, path: string) => {
  const tree = parser.parse(text);
  const buttons: { button: Button; hasId: boolean }[] = [];
  buttonVisitor(tree, (node: ButtonNode, args: Args) => {
    let hasId = true;
    if (!args.id) {
      hasId = false;
    }
    const button = createButtonObject(node, args, path);
    buttons.push({ button, hasId });
  });
  return buttons;
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
  const generatedId = nanoid(6);
  const stringArray = ["```button"];
  args.name && stringArray.push(`name ${args.name}`);
  args.type && stringArray.push(`type ${args.type}`);
  args.action && stringArray.push(`action ${args.action}`);
  args.color && stringArray.push(`color ${args.color}`);
  args.class && stringArray.push(`class ${args.class}`);
  args.remove && stringArray.push(`remove true`);
  args.replace && stringArray.push(`replace ${args.replace}`);
  args.id
    ? stringArray.push(`id ${args.id}`)
    : stringArray.push(`id ${generatedId}`);
  stringArray.push("```");
  const buttonString = stringArray.join("\n");
  return {
    start: node.position.start.line,
    end: node.position.end.line,
    args,
    path,
    id: args.id ? args.id : generatedId,
    buttonString,
  };
};

// Calculate
export const findNumber = (note: string, lineNumber: number) => {
  const tree = parser.parse(note);
  const value: string[] = [];
  visit(tree, "text", (node: TextNode) => {
    if (node.position.start.line === lineNumber) {
      const line: string = node.value;
      value.push(line);
    }
  });
  const convertWords = value
    .join("")
    .replace("plus", "+")
    .replace("minus", "-")
    .replace("times", "*")
    .replace(/divide(d)?(\sby)?/g, "/");
  const numbers = convertWords.replace(/\s/g, "").match(/[^\w:]+?\d+?/g);
  return numbers;
};
