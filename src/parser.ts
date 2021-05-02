import { Arguments, Position } from "./types";

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
    console.log(codeblock);
    if (codeblock.includes("button") && codeblock.includes(args.name)) {
      finalPosition = position;
    }
  });
  console.log(finalPosition);
  return finalPosition;
};
