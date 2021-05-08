import { App } from "obsidian";
import { Arguments, Position } from "./types";
import { createContentArray } from "./utils";

export const getButtonPosition = (
  content: string,
  args: Arguments
): Position => {
  let finalPosition: Position;
  const possiblePositions: Position[] = [];
  let possiblePosition: Position = { lineStart: 0, lineEnd: 0 };
  const contentArray = content.split("\n");
  let open = false;
  contentArray.forEach((item, index) => {
    if (item.includes("```")) {
      if (open === false) {
        possiblePosition.lineStart = index;
        open = true;
      } else {
        possiblePosition.lineEnd = index;
        possiblePositions.push(possiblePosition);
        possiblePosition = { lineStart: 0, lineEnd: 0 };
        open = false;
      }
    }
  });
  possiblePositions.forEach((position) => {
    const codeblock = contentArray
      .slice(position.lineStart, position.lineEnd + 1)
      .join("\n");
    if (codeblock.includes("button") && codeblock.includes(args.name)) {
      finalPosition = position;
    }
  });
  return finalPosition;
};

export const getInlineButtonPosition = async (
  app: App,
  id: string
): Promise<Position> => {
  const content = await createContentArray(app);
  const position = { lineStart: 0, lineEnd: 0 };
  content.contentArray
    .map((line: string) => line.split(" "))
    .forEach((words, index) => {
      words.forEach((word) => {
        if (word.startsWith("`button")) {
          if (word === `\`button-${id}\``) {
            position.lineStart = index;
            position.lineEnd = index;
          }
        }
      });
    });
  return position;
};

export const findNumber = async (
  app: App,
  lineNumber: number
): Promise<string[]> => {
  const content = await createContentArray(app);
  const value: string[] = [];
  content.contentArray.forEach((line: string, index: number) => {
    if (index === lineNumber - 1) {
      value.push(line);
    }
  });
  const convertWords = value
    .join("")
    .replace("plus", "+")
    .replace("minus", "-")
    .replace("times", "*")
    .replace(/divide(d)?(\sby)?/g, "/");
  const numbers = convertWords.replace(/\s/g, "").match(/[^\w:]*?\d+?/g);
  return numbers;
};
