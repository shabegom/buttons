import Buttons from "../main";
import {
  WidgetType,
  Range,
  EditorView,
  Decoration,
  ViewUpdate,
  ViewPlugin,
  DecorationSet,
} from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { createOnclick } from "../handlers";
import { ButtonCache } from "../types";

function inlineButtons(view: EditorView, plugin: Buttons) {
  const buttons: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (type, from, to) => {
        if (type.name == "inline-code") {
          const selection = view.state.selection;
          if (
            selection &&
            selection.main.to < to + 1 &&
            selection.main.from > from - 1
          ) {
            return;
          }
          const text = view.state.doc.sliceString(from, to);
          if (text.match(/button-[\d\w]{1,6}/)) {
            const id = text.split("-")[1];
            console.log(
              "this is the pageIndex in the plugin",
              plugin.pageIndex
            );
            const button = plugin.pageIndex.find((b) => b.id == id);
            if (button) {
              const onClick = createOnclick(
                button.args,
                plugin.app,
                plugin.index
              );
              const deco = Decoration.replace({
                widget: new ButtonWidget(button.args.name, onClick),
                from,
                to,
              });
              buttons.push(deco.range(from, to));
            }
          }
        }
      },
    });
  }
  return Decoration.set(buttons);
}
function buttonPlugin(plugin: Buttons) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      effects: StateEffect<unknown>[];

      constructor(view: EditorView) {
        this.decorations = inlineButtons(view, plugin);
        this.effects = [pageIndexEffect.of(plugin.pageIndex)];
        if (!view.state.field(pageIndexField)) {
          this.effects.push(StateEffect.appendConfig.of(pageIndexField));
        }
        view.dispatch({ effects: this.effects });
      }

      update(update: ViewUpdate): void {
        this.decorations = inlineButtons(update.view, plugin);
        this.effects = [pageIndexEffect.of(plugin.pageIndex)];
        update.view.dispatch({ effects: this.effects });
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}

class ButtonWidget extends WidgetType {
  constructor(readonly name: string, readonly onClick: () => void) {
    super();
  }
  toDOM(): HTMLElement {
    const button = document.createElement("button");
    button.innerText = this.name;
    button.addClass("button-default");
    button.onclick = this.onClick;
    return button;
  }
}

const pageIndexEffect = StateEffect.define<ButtonCache[]>();

const pageIndexField = StateField.define<ButtonCache[]>({
  create: () => Buttons.prototype.getPageIndex(),
  update: () => {
    const index = Buttons.prototype.getPageIndex();
    return index;
  },
  provide: (f) => f,
});

export default buttonPlugin;
