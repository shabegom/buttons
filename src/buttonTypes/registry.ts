import { App } from "obsidian";
import { Arguments, Position } from "../types";

export interface ButtonHandler {
  (app: App, args: Arguments, position: Position): Promise<void> | void;
}

export interface TemplaterHandler {
  (app: App, position: Position): Promise<Arguments>;
}

export interface ButtonHandlerRegistry {
  [key: string]: ButtonHandler;
}

export interface TemplaterHandlerRegistry {
  templater?: TemplaterHandler;
}

// This will be populated by the individual button type files
export const buttonHandlers: ButtonHandlerRegistry = {};
export const templaterHandler: TemplaterHandlerRegistry = {};

export const registerButtonHandler = (type: string, handler: ButtonHandler) => {
  buttonHandlers[type] = handler;
};

export const registerTemplaterHandler = (handler: TemplaterHandler) => {
  templaterHandler.templater = handler;
};

export const getButtonHandler = (type: string): ButtonHandler | undefined => {
  return buttonHandlers[type];
};

export const getTemplaterHandler = (): TemplaterHandler | undefined => {
  return templaterHandler.templater;
}; 