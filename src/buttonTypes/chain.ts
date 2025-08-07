import { App, TFile, Notice } from "obsidian";

import { Arguments, Position } from "../types";
import { getButtonPosition, getInlineButtonPosition } from "../parser";
import { command } from "./command";
import { copy } from "./copy";
import { link } from "./link";
import { template } from "./template";
import { calculate } from "./calculate";
import { text } from "./text";
import templater from "../templater";

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
      
      // Process templater commands for each action if templater is enabled on the chain button
      let processedAction = actionArgs.action;
      let processedType = actionArgs.type;
      
      if (args.templater) {
        try {
          const activeFile = file || app.workspace.getActiveFile();
          if (activeFile) {
            const runTemplater = await templater(app, activeFile, activeFile);
            if (runTemplater) {
              // Process action field if it contains templater expressions
              if (actionArgs.action && actionArgs.action.includes("<%")) {
                processedAction = await runTemplater(actionArgs.action);
              }
              
              // Process type field if it contains templater expressions (for note titles)
              if (actionArgs.type && actionArgs.type.includes("<%")) {
                processedType = await runTemplater(actionArgs.type);
              }
            }
          }
        } catch (error) {
          console.error('Error processing templater in chain action:', error);
          new Notice("Error processing templater in chain action. Check console for details.", 2000);
        }
      }
      
      // Update the action and type with the processed templater results
      actionArgs.action = processedAction;
      actionArgs.type = processedType;
      
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