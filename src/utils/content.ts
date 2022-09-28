// TODO: manage append/prepend with mutations
import { MarkdownView, Notice, TFile } from "obsidian";
import { ButtonCache } from "../types";
import { getCurrentMode, templater, toggleMode } from "./";

function getEditor() {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (!activeView) return;
  const { editor } = activeView;
  return editor;
}

export async function processTemplate(file: TFile) {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater();
    const processed = await runTemplater(content);
    return processed;
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

function appendContent(button: ButtonCache, file: TFile) {
  const mode = getCurrentMode();
  const editor = getEditor();
  const { position, args } = button;
  // is the start and end position are the same it is an inline button
  let appendPosition =
    position.start.line === position.end.line
      ? position.end.line
      : position.end.line + 2;
  // need to change the position if the button is being removed
  if (args.mutations && args.mutations.remove) {
    appendPosition = position.start.line;
  }
  processTemplate(file).then((processed) => {
    if (mode === "preview") {
      appendPosition = appendPosition + 1;
    }
    const replaceRange = toggleMode(editor.replaceRange.bind(editor));
    replaceRange(processed, { line: appendPosition, ch: 0 });
  });
}

function prependContent(button: ButtonCache, file: TFile) {
  const editor = getEditor();
  const { position } = button;
  const prependPosition = position.start.line - 1;
  processTemplate(file).then((content) => {
    const replaceRange = toggleMode(editor.replaceRange);
    replaceRange(content, { line: prependPosition, ch: 0 });
  });
}

function insertContent(button: ButtonCache, file: TFile) {
  const editor = getEditor();
  const { args } = button;
  const { type } = args;
  const start = type.match(/\((\d*)\)/)[1];
  processTemplate(file).then((content) => {
    const replaceRange = toggleMode(editor.replaceRange);
    replaceRange(content, { line: parseInt(start, 10) - 1, ch: 0 });
  });
}

export { appendContent, getEditor, insertContent, prependContent };
