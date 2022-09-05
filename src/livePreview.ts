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

const widgets: ElementCache[] = [];

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
          let el = createEl("button");
          el.addClass("button-default");
          const id = content.match(/button-([\d\w]{1,6})/)[1];
          if (id) {
            const cachedElement = widgets && widgets.find((w) => w.id === id);
            if (cachedElement) {
              el = cachedElement.el;
              const deco = Decoration.replace({
                widget: new CachedButtonWidget(el),
                from: node.from,
                to: node.to,
              });
              buttons.push(deco.range(node.from, node.to));
            } else {
              const deco = Decoration.replace({
                widget: new ButtonWidget(el, id, plugin),
                from: node.from,
                to: node.to,
              });
              buttons.push(deco.range(node.from, node.to));
            }
          }
        }
        if (content.includes("^button")) {
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
        if (update.docChanged || update.viewportChanged) {
          this.decorations = inlineButtons(update.view, plugin);
        }
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}

interface ElementCache {
  id: string;
  el: HTMLButtonElement;
}

class CachedButtonWidget extends WidgetType {
  constructor(readonly el: HTMLButtonElement) {
    super();
  }

  toDOM() {
    return this.el;
  }
}

class ButtonWidget extends WidgetType {
  constructor(
    readonly el: HTMLElement,
    readonly id: string,
    readonly plugin: Buttons
  ) {
    super();
  }
  toDOM(): HTMLElement {
    this.plugin.getInlineButton(this.id).then((button) => {
      if (button) {
        const name = button.args.name;
        const className = button.args.class;
        const onClick = createOnclick(this.plugin, button);
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
        const cachedElement = widgets.find((w) => w.id === this.id);
        if (!cachedElement) {
          widgets.push({ id: this.id, el: this.el as HTMLButtonElement });
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
