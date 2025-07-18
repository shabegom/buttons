import { App } from "obsidian";

import { Arguments } from "../types";
import { removeButton } from "../handlers";

export const remove = async (
  app: App,
  { remove }: Arguments,
  { lineStart, lineEnd }: { lineStart: number; lineEnd: number }
): Promise<void> => {
  await removeButton(app, remove, lineStart, lineEnd);
}; 