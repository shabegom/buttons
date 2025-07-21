import { App, MarkdownView, Notice, TFile } from "obsidian";
import templater from "../templater";
import { Position } from "../types";

export const addContentAtLine = async (
  app: App,
  insert: string | TFile,
  type: string,
  isTemplater: boolean,
  buttonPosition?: Position,
): Promise<void> => {
  let insertionPoint: number;
  
  // Check for relative line number syntax line(+N) or line(-N)
  const relativeMatch = type.match(/line\(([+-])(\d+)\)/);
  if (relativeMatch && buttonPosition) {
    const operator = relativeMatch[1];
    const offset = parseInt(relativeMatch[2]);
    
    if (operator === '+') {
      // Insert N lines after the button (relative to button's end line)
      insertionPoint = buttonPosition.lineEnd + offset;
    } else {
      // Insert N lines before the button (relative to button's start line)
      insertionPoint = buttonPosition.lineStart - offset;
      // Ensure we don't go below line 0
      if (insertionPoint < 0) {
        insertionPoint = 0;
      }
    }
  } else {
    // Fall back to absolute line number parsing for backward compatibility
    const lineNumber = type.match(/(\d+)/g);
    if (lineNumber && lineNumber[0]) {
      insertionPoint = parseInt(lineNumber[0]) - 1;
    } else {
      new Notice("There was an issue parsing the line number, please try again", 2000);
      return;
    }
  }
  
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
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
  }
}; 