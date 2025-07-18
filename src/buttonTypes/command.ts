import { App, MarkdownView, Notice } from "obsidian";

import { Arguments, Position } from "../types";

export const command = (app: App, args: Arguments, buttonStart: Position): void => {
  const allCommands = app.commands.listCommands();
  const action = args.action;
  
  // Find the command by name
  const command = allCommands.filter(
    (command) => command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  
  // Check if command was found
  if (!command) {
    new Notice(`Command "${action}" not found. Available commands can be found in the Command Palette.`);
    console.error(`Button command error: Command "${action}" not found.`);
    console.log('Available commands:', allCommands.map(cmd => cmd.name));
    return;
  }
  
  try {
    if (args.type.includes("prepend")) {
      app.workspace.getActiveViewOfType(MarkdownView).editor.setCursor(buttonStart.lineStart,0);
      app.commands.executeCommandById(command.id);
    }
    if (args.type.includes("append")) {
      app.workspace.getActiveViewOfType(MarkdownView).editor.setCursor(buttonStart.lineEnd+2,0);
      app.commands.executeCommandById(command.id);
    }
    if (args.type === "command") {
      app.commands.executeCommandById(command.id);
    }
  } catch (error) {
    new Notice(`Failed to execute command "${action}": ${error.message}`);
    console.error(`Button command execution error:`, error);
  }
}; 