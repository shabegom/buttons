import { App, TFile, Notice } from "obsidian";

import { Position } from "../types";
import { getButtonPosition, getInlineButtonPosition } from "../parser";
import { handleValueArray } from "../utils";
import {
  getButtonSwapById,
  setButtonSwapById,
  getButtonById,
} from "../buttonStore";
import { templater } from "./templater";
import { replace } from "./replace";
import { command } from "./command";
import { link } from "./link";
import { template } from "./template";
import { calculate } from "./calculate";
import { text } from "./text";
import { remove } from "./remove";

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
        args = await templater(app, position);
        if (inline) {
          new Notice("templater args don't work with inline buttons yet", 2000);
        }
      }
      if (args.replace) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await replace(app, args, position);
      }
      if (args.type === "command") {
        command(app, args, buttonStart);
      }
      // handle link buttons
      if (args.type === "link") {
        link(args);
      }
      // handle template buttons
      if (args.type && args.type.includes("template")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await template(app, args, position);
      }
      if (args.type === "calculate") {
        await calculate(app, args, position);
      }
      if (args.type && args.type.includes("text")) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await text(app, args, position);
      }
      // handle removing the button
      if (args.remove) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await remove(app, args, position);
      }
      if (args.replace) {
        content = await app.vault.read(file);
        position = inline
          ? await getInlineButtonPosition(app, id)
          : getButtonPosition(content, args);
        await replace(app, args, position);
      }
    }
  });
}; 