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
export function selectionAndRangeOverlap(
  selection: EditorSelection,
  rangeFrom: number,
  rangeTo: number
): boolean {
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
        const content = view.state.doc.sliceString(node.from, node.to);
        // don't continue if current cursor position and inline code node (including formatting
        // symbols) overlap
        if (selectionAndRangeOverlap(selection, node.from - 1, node.to + 1)) {
          return;
        }
        if (node.type.name.includes("formatting")) return;
        if (regex.test(node.type.name)) {
          const id = content.match(/button-([\s\S]*)/)[1];
          if (id) {
            const line = view.state.doc.lineAt(node.to).number;
            const el = createEl("button");
            el.addClass("button-default");
            const deco = Decoration.replace({
              widget: new ButtonWidget(el, id, plugin, line),
              from: node.from,
              to: node.to,
            });
            buttons.push(deco.range(node.from, node.to));
          }
        } else if (content.includes("^button-")) {
          const deco = Decoration.mark({
            attributes: { style: "display: none" },
            from: node.from,
            to: node.to,
          });
          buttons.push(deco.range(node.from, node.to));
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
    readonly el: HTMLElement,
    readonly id: string,
    readonly plugin: Buttons,
    readonly line: number
  ) {
    super();
  }
  eq(other: ButtonWidget): boolean {
    if (other.id === this.id) {
      return true;
    }
    return false;
  }

  toDOM(): HTMLElement {
    this.plugin.getInlineButton(this.id, this.line).then((button) => {
      if (button) {
        console.log(this.line);
        const buttonPositionClone = JSON.parse(JSON.stringify(button.position));
        const name = button.args.name;
        const className = button.args.class;
        const onClick = createOnclick(this.plugin, {
          inline: true,
          file: button.file,
          id: button.id,
          args: button.args,
          position: buttonPositionClone,
        });
        const color = button.args.color;
        this.el.innerText = name;
        if (className) {
          this.el.addClass(className);
          this.el.removeClass("button-default");
        }
        this.el.onclick = onClick;
        if (color) {
          this.el.addClass(color);
        }
      } else {
        this.el.innerText = "button not foud. check button Id";
        this.el.removeClass("button-default");
        this.el.addClass("button-error");
      }
    });
    return this.el;
  }
}

export default buttonPlugin;
