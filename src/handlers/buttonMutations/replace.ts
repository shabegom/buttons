import { getEditor } from "../../utils";

// TODO: test replaceMutatition
function replaceMutation(ids: string) {
  return () => {
    const editor = getEditor();
    const match = ids.match(/\[(\d*),(\d*)\]/);
    const [, start, end] = match;
    editor.setSelection(
      { line: parseInt(start, 10) - 1, ch: 0 },
      { line: parseInt(end, 10) - 1, ch: 0 }
    );
    editor.replaceSelection("");
  };
}

export default replaceMutation;
