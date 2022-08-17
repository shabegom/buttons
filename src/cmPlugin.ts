import Buttons from "./main";
import {
  WidgetType,
  Range,
  EditorView,
  Decoration,
  ViewUpdate,
  ViewPlugin,
  DecorationSet,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { createOnclick } from "./handlers";

function inlineButtons(view: EditorView, plugin: Buttons) {
  const buttons: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (type, from, to)  => {
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
            const button = plugin.currentFileButtons.find((b) => b.id == id);
            if (button) {
            const onClick = createOnclick(button.args, plugin.app, plugin.index, button)
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

export default buttonPlugin;
