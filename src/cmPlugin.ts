import Buttons from "./main";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { EditorSelection, Range } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { createOnclick } from "./handlers";

// from: https://github.com/blacksmithgu/obsidian-dataview/blob/03d0c5de51e992a650de0c1c769093bedb1c7817/src/ui/lp-render.ts#L44
function selectionAndRangeOverlap(
  selection: EditorSelection,
  rangeFrom: number,
  rangeTo: number
) {
  for (const range of selection.ranges) {
    if (range.from <= rangeTo && range.to >= rangeFrom) {
      return true;
    }
  }

  return false;
}

function inlineButtons(view: EditorView, plugin: Buttons) {
  const regex = new RegExp(".*?_?inline-code_?.*");
  const selection = view.state.selection;
  const buttons: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: ({ node }) => {
        if (node.type.name.includes("formatting")) return;
        if (regex.test(node.type.name)) {
          // don't continue if current cursor position and inline code node (including formatting
          // symbols) overlap
          if (selectionAndRangeOverlap(selection, node.from - 1, node.to + 1)) {
            return;
          }
          const text = view.state.doc.sliceString(node.from, node.to);
          const id = text.match(/button-([\d\w]{1,6})/)[1];
          if (id) {
            const button = plugin.currentFileButtons.find((b) => b.id == id);
            if (button) {
              const onClick = createOnclick(
                button.args,
                plugin.app,
                plugin.index,
                button
              );
              const deco = Decoration.replace({
                widget: new ButtonWidget(button.args.name, onClick),
                from: node.from,
                to: node.to,
              });
              buttons.push(deco.range(node.from, node.to));
            }
          }
        }
      },
    });
  }
  return Decoration.set(buttons);
}
/**
 * @param plugin - the obsidian plugin instance
 * @returns
 */
function buttonPlugin(plugin: Buttons) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = inlineButtons(view, plugin);
      }

      update(update: ViewUpdate): void {
        this.decorations = inlineButtons(update.view, plugin);
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}

class ButtonWidget extends WidgetType {
  constructor(
    readonly name: string,
    readonly onClick: () => void,
    readonly className?: string,
    readonly color?: string
  ) {
    super();
  }
  toDOM(): HTMLElement {
    const button = document.createElement("button");
    button.innerText = this.name;
    button.addClass(
      `${this.className ? this.className : "button-default"} ${
        this.color ? this.color : ""
      }`
    );
    button.onclick = this.onClick;
    return button;
  }
}

export default buttonPlugin;
