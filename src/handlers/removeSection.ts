import { App } from "obsidian";
import { createContentArray } from "../utils";

export const removeSection = async (
  app: App,
  section: string,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  if (section.includes("[") && section.includes("]")) {
    const args = section.match(/\[(.*)\]/);
    if (args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        const start = parseInt(argArray[0]) - 1;
        const end = parseInt(argArray[1]);
        const numLines = end - start;
        contentArray.splice(start, numLines);
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    }
  }
}; 