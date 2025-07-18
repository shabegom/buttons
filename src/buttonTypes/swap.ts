import { App, TFile, Notice } from "obsidian";

import { Position } from "../types";
import { getButtonPosition, getInlineButtonPosition } from "../parser";
import { handleValueArray } from "../utils";
import {
  getButtonSwapById,
  setButtonSwapById,
  getButtonById,
} from "../buttonStore";

import { getButtonHandler, getTemplaterHandler } from "./registry";

export const swap = async (
  app: App,
  swap: string,
  id: string,
  inline: boolean,
  file: TFile,
  buttonStart: Position
): Promise<void> => {
  handleValueArray(swap, async (argArray) => {
    const swap = await getButtonSwapById(app, id);
    const newSwap = swap + 1 > argArray.length - 1 ? 0 : swap + 1;
    setButtonSwapById(app, id, newSwap);
    let args = await getButtonById(app, argArray[swap]);
    let position;
    let content;
    if (args) {
      if (args.templater) {
        // Handle templater separately
        const templaterHandler = getTemplaterHandler();
        if (templaterHandler) {
          args = await templaterHandler(app, position);
        }
        if (inline) {
          new Notice("templater args don't work with inline buttons yet", 2000);
        }
      }
      if (args.replace) {
        const replaceHandler = getButtonHandler("replace");
        if (replaceHandler) {
          await replaceHandler(app, args, position);
        }
      }
      if (args.type === "command") {
        const commandHandler = getButtonHandler("command");
        if (commandHandler) {
          commandHandler(app, args, buttonStart);
        }
      }
      // handle link buttons
      if (args.type === "link") {
        const linkHandler = getButtonHandler("link");
        if (linkHandler) {
          linkHandler(app, args, position);
        }
      }
      // handle template buttons
      if (args.type && args.type.includes("template")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        const templateHandler = getButtonHandler("template");
        if (templateHandler) {
          await templateHandler(app, args, position);
        }
      }
      if (args.type === "calculate") {
        const calculateHandler = getButtonHandler("calculate");
        if (calculateHandler) {
          await calculateHandler(app, args, position);
        }
      }
      if (args.type && args.type.includes("text")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        const textHandler = getButtonHandler("text");
        if (textHandler) {
          await textHandler(app, args, position);
        }
      }
      // handle removing the button
      if (args.remove) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        const removeHandler = getButtonHandler("remove");
        if (removeHandler) {
          await removeHandler(app, args, position);
        }
      }
      if (args.replace) {
        const replaceHandler = getButtonHandler("replace");
        if (replaceHandler) {
          await replaceHandler(app, args, position);
        }
      }
    }
  });
}; 