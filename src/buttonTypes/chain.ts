import { App, TFile, Notice } from "obsidian";

import { Arguments, Position } from "../types";
import { getButtonPosition, getInlineButtonPosition } from "../parser";
import { command } from "./command";
import { copy } from "./copy";
import { link } from "./link";
import { template } from "./template";
import { calculate } from "./calculate";
import { text } from "./text";

export const chain = async (
  app: App,
  args: Arguments,
  position: Position,
  inline?: boolean,
  id?: string,
  file?: TFile
): Promise<void> => {
  if (!Array.isArray(args.actions)) {
    new Notice("No actions array found for chain button.");
    return;
  }
  for (const actionObj of args.actions) {
    try {
      // Prepare a minimal Arguments object for each action
      const actionArgs: Arguments = { ...args, ...actionObj };
      // Recalculate position for each action if needed
      let currentPosition = position;
      // For text/template actions, re-read file and recalculate position
      if (
        actionArgs.type &&
        (actionArgs.type.includes("text") || actionArgs.type.includes("template"))
      ) {
        if (file) {
          const content = await app.vault.read(file);
          currentPosition = inline && id
            ? await getInlineButtonPosition(app, id)
            : getButtonPosition(content, actionArgs);
        }
      }
      if (actionArgs.type && actionArgs.type.includes("command")) {
        command(app, actionArgs, currentPosition);
      } else if (actionArgs.type === "copy") {
        copy(actionArgs);
      } else if (actionArgs.type === "link") {
        link(actionArgs);
      } else if (actionArgs.type && actionArgs.type.includes("template")) {
        await template(app, actionArgs, currentPosition);
      } else if (actionArgs.type === "calculate") {
        await calculate(app, actionArgs, currentPosition);
      } else if (actionArgs.type && actionArgs.type.includes("text")) {
        await text(app, actionArgs, currentPosition);
      } else if (actionArgs.type === "chain") {
        // Support nested chains
        await chain(app, actionArgs, currentPosition, inline, id, file);
      } else {
        new Notice(`Unsupported action type in chain: ${actionArgs.type}`);
      }
    } catch (e) {
      console.error("Error executing chain action:", actionObj, e);
      new Notice(`Error executing chain action: ${actionObj.type}`);
      // Continue to next action
    }
  }
}; 