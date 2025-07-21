import { App, MarkdownView, Notice, TFile } from "obsidian";
import templater from "../templater";

export const prependContent = async (
  app: App,
  insert: string | TFile,
  lineStart: number,
  isTemplater: boolean,
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    if (typeof insert === "string") {
      // Handle multi-line content by splitting into individual lines
      const lines = insert.split("\n");
      contentArray.splice(lineStart, 0, ...lines);
    } else {
      if (isTemplater) {
        const runTemplater = await templater(app, insert, file);
        if (runTemplater) {
          try {
            const templateContent = await app.vault.read(insert);
            const processed = await runTemplater(templateContent);
            // Handle multi-line templated content
            const lines = processed.split("\n");
            contentArray.splice(lineStart, 0, ...lines);
          } catch (error) {
            console.error("Templater processing error:", error);
            new Notice("Failed to process Templater template. Check console for details.", 2000);
            return;
          }
        } else {
          new Notice("Failed to initialize Templater processor", 2000);
          return;
        }
      } else {
        // For core Templates plugin, just use insertTemplate directly
        // Set cursor to the insertion point and let insertTemplate handle everything
        activeView.editor.setCursor(lineStart);
        await app.internalPlugins?.plugins["templates"].instance
          .insertTemplate(insert);
        return; // Don't modify the file again, insertTemplate already did the work
      }
    }
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue prepending content, please try again", 2000);
  }
}; 