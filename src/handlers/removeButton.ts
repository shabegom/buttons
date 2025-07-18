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
  }
  if (lineStart === lineEnd) {
    contentArray.splice(lineStart, 1);
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    handleValueArray(remove, async (argArray) => {
      const buttons = store &&
        store.filter((item: ExtendedBlockCache) => {
          let exists;
          argArray.forEach((arg) => {
            if (item.id === `button-${arg}` && item.path === file.path) {
              exists = true;
            }
          });
          return exists;
        });
      if (buttons[0]) {
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
  }
}; 