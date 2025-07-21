import { App, MarkdownView } from "obsidian";

import { Arguments, Position } from "../types";
import { removeSection } from "../handlers";

export const replace = async (
  app: App,
  { replace }: Arguments,
  position?: Position
): Promise<void> => {
  let cursorPosition: number | undefined;
  
  // Check if replace contains [cursor] syntax and capture cursor position immediately
  if (replace.includes("[cursor]")) {
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const editor = activeView.editor;
      const cursor = editor.getCursor();
      cursorPosition = cursor.line; // 0-based line number from editor
    }
  }
  
  await removeSection(app, replace, position, cursorPosition);
}; 