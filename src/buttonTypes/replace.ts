import { App } from "obsidian";

import { Arguments } from "../types";
import { removeSection } from "../handlers";

export const replace = async (
  app: App,
  { replace }: Arguments
): Promise<void> => {
  await removeSection(app, replace);
}; 