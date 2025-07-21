import { App, MarkdownView, Notice, TFile } from "obsidian";
import templater from "../templater";

export const addContentAtCursor = async (
  app: App,
  insert: string | TFile,
  isTemplater: boolean
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const editor = activeView.editor;
    const cursor = editor.getCursor();
    
    if (typeof insert === "string") {
      // For plain text, insert directly at cursor position
      editor.replaceRange(insert, cursor);
      // Move cursor to end of inserted text
      const lines = insert.split("\n");
      if (lines.length === 1) {
        editor.setCursor({
          line: cursor.line,
          ch: cursor.ch + insert.length
        });
      } else {
        editor.setCursor({
          line: cursor.line + lines.length - 1,
          ch: lines[lines.length - 1].length
        });
      }
    } else {
      // For template files
      if (isTemplater) {
        const file = activeView.file;
        const runTemplater = await templater(app, insert, file);
        if (runTemplater) {
          const templateContent = await app.vault.read(insert);
          const processed = await runTemplater(templateContent);
          
          // Insert processed template content at cursor
          editor.replaceRange(processed, cursor);
          
          // Move cursor to end of inserted content
          const lines = processed.split("\n");
          if (lines.length === 1) {
            editor.setCursor({
              line: cursor.line,
              ch: cursor.ch + processed.length
            });
          } else {
            editor.setCursor({
              line: cursor.line + lines.length - 1,
              ch: lines[lines.length - 1].length
            });
          }
        } else {
          new Notice("Failed to initialize Templater processor", 2000);
          return;
        }
      } else {
        // For core Templates plugin, use insertTemplate at cursor position
        await app.internalPlugins?.plugins["templates"].instance
          .insertTemplate(insert);
      }
    }
  } else {
    new Notice("There was an issue inserting content at cursor, please try again", 2000);
  }
}; 