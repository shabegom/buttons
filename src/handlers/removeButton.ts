import { App } from "obsidian";
import { ExtendedBlockCache } from "../types";
import { getStore } from "../buttonStore";
import { createContentArray, handleValueArray } from "../utils";

export const removeButton = async (
  app: App,
  remove: string,
  lineStart: number,
  lineEnd: number,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  const store = getStore(app.isMobile);
  
  // Handle remove === "true" case
  if (remove === "true") {
    const numberOfItems = lineEnd - lineStart;
    contentArray.splice(lineStart, numberOfItems + 1);
    if (
      contentArray[lineStart] &&
      contentArray[lineStart].includes("^button-")
    ) {
      contentArray.splice(lineStart, 1);
    }
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
    return; // Exit early to prevent overlapping logic
  }
  
  // Handle lineStart === lineEnd case
  if (lineStart === lineEnd) {
    contentArray.splice(lineStart, 1);
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
    return; // Exit early to prevent overlapping logic
  }
  
  // Handle other cases with button filtering
  handleValueArray(remove, async (argArray) => {
    // Check if store exists before filtering
    if (!store) {
      return;
    }
    
    const buttons = store.filter((item: ExtendedBlockCache) => {
      let exists = false; // Initialize exists variable
      argArray.forEach((arg) => {
        if (item.id === `button-${arg}` && item.path === file.path) {
          exists = true;
        }
      });
      return exists;
    });
    
    // Check if buttons array exists and has items
    if (buttons && buttons.length > 0) {
      let offset = 0;
      buttons.forEach((button: ExtendedBlockCache) => {
        const start = button.position.start.line - offset;
        const numLines = button.position.end.line -
          button.position.start.line;
        contentArray.splice(start, numLines + 2);
        offset += numLines + 2;
      });
      const content = contentArray.join("\n");
      await app.vault.modify(file, content);
    }
  });
}; 