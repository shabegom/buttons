import {App, Pos, MarkdownView} from 'obsidian'

const removeButtonInCurrentNote = (app: App, position: Pos) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView)
  if (activeView) {
    const editor = activeView.editor
    const from = editor.offsetToPos(position.start.offset)
    const to = editor.offsetToPos(position.end.offset)
    editor.replaceRange("", from, to)
  }

}

export {removeButtonInCurrentNote}
