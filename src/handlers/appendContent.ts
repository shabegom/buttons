import { App, MarkdownView, Notice, TFile } from "obsidian";
import templater from "../templater";

export const appendContent = async (
  app: App,
  insert: string | TFile,
  lineEnd: number,
  isTemplater: boolean,
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    let insertionPoint;
    if (
      contentArray[lineEnd + 1] &&
      contentArray[lineEnd + 1].includes("^button")
    ) {
      insertionPoint = lineEnd + 2;
    } else {
      insertionPoint = lineEnd + 1;
    }
    if (typeof insert === "string") {
      // Handle multi-line content by splitting into individual lines
      const lines = insert.split("\n");
      contentArray.splice(insertionPoint, 0, ...lines);
    } else {
      if (isTemplater) {
        const runTemplater = await templater(app, insert, file);
        const content = await app.vault.read(insert);
        const processed = await runTemplater(content);
        // Handle multi-line templated content
        const lines = processed.split("\n");
        contentArray.splice(insertionPoint, 0, ...lines);
      } else {
        // For core Templates plugin, just use insertTemplate directly
        // Set cursor to the insertion point and let insertTemplate handle everything
        activeView.editor.setCursor(insertionPoint);
        await app.internalPlugins?.plugins["templates"].instance
          .insertTemplate(insert);
        return; // Don't modify the file again, insertTemplate already did the work
      }
    }
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue appending content, please try again", 2000);
  }
}; 