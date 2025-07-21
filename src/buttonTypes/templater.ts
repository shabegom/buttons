import { App, MarkdownView } from "obsidian";

import { Arguments, Position } from "../types";
import { getNewArgs } from "../utils";
import { processTemplate } from "../templater";

export const templater = async (
  app: App,
  position: Position
): Promise<Arguments> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    await activeView.save();
    const file = activeView.file;
    const content = await processTemplate(file);
    const { args } = await getNewArgs(app, position);
    const cachedData: string[] = [];
    const cacheChange = app.vault.on("modify", (file) => {
      cachedData.push(file.unsafeCachedData);
    });
    setTimeout(async () => {
      const button = content
        .split("\n")
        .splice(position.lineStart, position.lineEnd - position.lineStart + 2)
        .join("\n");
      let finalContent;
      if (cachedData[0]) {
        const cachedContent = cachedData[cachedData.length - 1].split("\n");
        let addOne = false;
        if (args.type.includes("prepend")) {
          addOne = true;
        } else if (args.type.includes("line")) {
          const lineNumber = args.type.match(/(\d+)/g);
          if (lineNumber[0]) {
            const line = parseInt(lineNumber[0]) - 1;
            if (line < position.lineStart && !args.replace) {
              addOne = true;
            }
          }
        }
        if (addOne) {
          cachedContent.splice(
            position.lineStart + 1,
            position.lineEnd - position.lineStart + 2,
            button
          );
        } else {
          cachedContent.splice(
            position.lineStart,
            position.lineEnd - position.lineStart + 2,
            button
          );
        }
        finalContent = cachedContent.join("\n");
      } else {
        finalContent = content;
      }
      await app.vault.modify(file, finalContent);
      app.metadataCache.offref(cacheChange);
    }, 200);
    return args;
  }
}; 