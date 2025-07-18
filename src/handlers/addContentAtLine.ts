import { App, MarkdownView, Notice, TFile } from "obsidian";
import templater from "../templater";

export const addContentAtLine = async (
  app: App,
  insert: string | TFile,
  type: string,
  isTemplater: boolean,
): Promise<void> => {
  const lineNumber = type.match(/(\d+)/g);
  if (lineNumber && lineNumber[0]) {
    const insertionPoint = parseInt(lineNumber[0]) - 1;
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const file = activeView.file;
      let content = await app.vault.read(file);
      const contentArray = content.split("\n");
      if (typeof insert === "string") {
        contentArray.splice(insertionPoint, 0, `${insert}`);
      } else {
        if (isTemplater) {
          const runTemplater = await templater(app, insert, file);
          const content = await app.vault.read(insert);
          const processed = await runTemplater(content);
          contentArray.splice(insertionPoint, 0, `${processed}`);
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
    }
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
}; 