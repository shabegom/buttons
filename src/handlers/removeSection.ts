import { App } from "obsidian";
import { createContentArray } from "../utils";

export const removeSection = async (
  app: App,
  section: string,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  if (section.includes("[") && section.includes("]")) {
    const args = section.match(/\[(.*)\]/);
    if (args && args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        const start = parseInt(argArray[0]) - 1;
        
        // Handle single number case (e.g., "[5]" - remove just line 5)
        if (argArray.length === 1) {
          contentArray.splice(start, 1);
        } else {
          // Handle range case (e.g., "[5,10]" - remove lines 5-10)
          const end = parseInt(argArray[1]);
          if (!isNaN(end)) {
            const numLines = end - start;
            contentArray.splice(start, numLines);
          }
        }
        
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    }
  }
}; 