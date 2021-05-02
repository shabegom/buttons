import parse from "remark-parse";
import unified from "unified";
import { visit } from "unist-util-visit";
import { Node } from "unist";
import { Arguments } from "./types";

const parser = unified().use(parse);

interface ButtonNode extends Node {
  lang: string;
  value: string;
}

interface Position {
  lineStart: number;
  lineEnd: number;
}

export const getButtonPosition = (
  content: string,
  args: Arguments
): Position => {
  const tree = parser.parse(content);
  const position = { lineStart: 0, lineEnd: 0 };
  visit(tree, "code", (node: ButtonNode) => {
    if (node.lang === "button") {
      if (args && node.value.includes(args.name)) {
        position.lineStart = node.position.start.line - 1;
        position.lineEnd = node.position.end.line - 1;
      }
    }
  });
  return position;
};
