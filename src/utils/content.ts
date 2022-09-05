import { MarkdownView, Notice, TFile } from "obsidian";
import { ButtonCache } from "../types";
import { templater } from "./";

function getEditor() {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (!activeView) return;
  const { editor } = activeView;
  return editor;
}

export async function processTemplate(file: TFile) {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(file);
    const processed = await runTemplater(content);
    return processed;
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

function appendContent(button: ButtonCache, file: TFile) {
  console.log("in append content function");
  const editor = getEditor();
  console.log(button);
  const { position } = button;
  const content = editor.getRange(
    { line: position.end.line, ch: 0 },
    { line: position.end.line + 2, ch: 0 }
  );
  console.log(content);
  processTemplate(file).then((processed) => {
    editor.replaceRange(processed, { line: position.end.line + 2, ch: 0 });
  });
}

// TODO: test prependContent actually works
function prependContent(button: ButtonCache, file: TFile) {
  const editor = getEditor();
  const { position } = button;
  processTemplate(file).then((content) => {
    editor.replaceRange(content, { line: position.start.line - 1, ch: 0 });
  });
}

// TODO: test insertContent actually works
function insertContent(button: ButtonCache, file: TFile) {
  const editor = getEditor();
  const { args } = button;
  const { type } = args;
  const start = type.match(/\((\d*)\)/)[1];
  processTemplate(file).then((content) => {
    editor.replaceRange(content, { line: parseInt(start, 10) - 1, ch: 0 });
  });
}

export { appendContent, getEditor, insertContent, prependContent };
