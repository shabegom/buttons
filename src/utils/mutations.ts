import { App, MarkdownView, Pos } from "obsidian";

const removeButtonInCurrentNote = (app: App, position: Pos) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const editor = activeView.editor;
    const from = editor.offsetToPos(position.start.offset);
    const to = editor.offsetToPos(position.end.offset);
    editor.setLine(to.line + 1, "");
    editor.replaceRange("", from, to);
  }
};
const replaceButtonInCurrentNote = (
  app: App,
  position: Pos,
  replacement: string
) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const editor = activeView.editor;
    const from = editor.offsetToPos(position.start.offset);
    const to = editor.offsetToPos(position.end.offset);
    editor.setLine(to.line + 1, "");
    editor.replaceRange(replacement, from, to);
  }
};

export { removeButtonInCurrentNote, replaceButtonInCurrentNote };
