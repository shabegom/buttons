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
import { getButtonById } from "./buttonStore";
import { createButton } from "./button";
import { App } from "obsidian";

// Check if selection and range overlap (from DataView plugin)
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

function inlineButtons(view: EditorView, app: App) {
  const regex = new RegExp(".*?_?inline-code_?.*");
  const selection = view.state.selection;
  const buttons: Range<Decoration>[] = [];
  
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: ({ node }) => {
        const content = view.state.doc.sliceString(node.from, node.to);
        // don't continue if current cursor position and inline code node overlap
        if (selectionAndRangeOverlap(selection, node.from - 1, node.to + 1)) {
          return;
        }
        if (node.type.name.includes("formatting")) return;
        if (regex.test(node.type.name)) {
          const matches = content.match(/button-([\s\S]*)/);
          const id = matches && matches[1] ? matches[1] : "";
          if (id) {
            const el = createEl("span");
            const deco = Decoration.replace({
              widget: new ButtonWidget(el, id, app),
              block: false,
            });
            buttons.push(deco.range(node.from, node.to));
          }
        }
      },
    });
  }
  return Decoration.set(buttons);
}

/**
 * Create a CM6 plugin for inline button rendering
 */
function buttonPlugin(app: App) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = inlineButtons(view, app);
      }

      update(update: ViewUpdate): void {
        this.decorations = inlineButtons(update.view, app);
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
    readonly app: App
  ) {
    super();
  }

  eq(other: ButtonWidget): boolean {
    return other.id === this.id;
  }

  toDOM(): HTMLElement {
    // Asynchronously get the button data and create the button
    getButtonById(this.app, this.id).then((args) => {
      if (args) {
        // Create the button element
        const buttonEl = createButton({
          app: this.app,
          el: this.el,
          args,
          inline: true,
          id: this.id,
        });
        
        // Replace the placeholder with the actual button
        if (buttonEl && this.el.parentNode) {
          this.el.parentNode.replaceChild(buttonEl, this.el);
        }
      } else {
        this.el.innerText = "button not found. check button ID";
        this.el.addClass("button-error");
      }
    });
    
    return this.el;
  }
}

export default buttonPlugin; 