import { App, MarkdownView } from "obsidian";
import { ButtonCache } from "../types";

function getEditor(app: App) {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (!activeView) return;
  const { editor } = activeView;
  return editor;
}

function appendContent(app: App, button: ButtonCache, content: string) {
  const editor = getEditor(app);
  const { position } = button;
  editor.replaceRange(content, { line: position.end.line + 3, ch: 0 });
}

// TODO: test prependContent actually works
function prependContent(app: App, button: ButtonCache, content: string) {
  const editor = getEditor(app);
  const { position } = button;
  editor.replaceRange(content, { line: position.start.line - 1, ch: 0 });
}

// TODO: test insertContent actually works
function insertContent(app: App, button: ButtonCache, content: string) {
  const editor = getEditor(app);
  const { args } = button;
  const { start } = args;
  editor.replaceRange(content, { line: start, ch: 0 });
}

export { appendContent, insertContent, prependContent };
