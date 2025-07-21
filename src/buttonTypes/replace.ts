import { App } from "obsidian";

import { Arguments, Position } from "../types";
import { removeSection } from "../handlers";

export const replace = async (
  app: App,
  { replace }: Arguments,
  position?: Position
): Promise<void> => {
  await removeSection(app, replace, position);
}; 