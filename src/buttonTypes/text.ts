import { App } from "obsidian";

import { Arguments, Position } from "../types";
import {
  appendContent,
  createNote,
  prependContent,
  addContentAtLine,
  addContentAtCursor,
} from "../handlers";

export const text = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  // prepend template above the button
  if (args.type.includes("prepend")) {
    await prependContent(app, args.action, position.lineStart, false);
  }
  // append template below the button
  if (args.type.includes("append")) {
    await appendContent(app, args.action, position.lineEnd, false);
  }
  if (args.type.includes("note")) {
    createNote(app, args.type, args.folder, args.prompt, args.action, false);
  }
  if (args.type.includes("line")) {
    await addContentAtLine(app, args.action, args.type, false, position);
  }
  if (args.type.includes("cursor")) {
    await addContentAtCursor(app, args.action, false);
  }
}; 