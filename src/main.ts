import { Plugin } from "obsidian";
import { button } from "./ui";
import { createArgs } from "./utils";
import { createOnclick } from "./handlers";
import { ButtonCache } from "./types";
import { buildIndex } from "./indexer";

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

export default class Buttons extends Plugin {
  index: ButtonCache[];

  onload(): void {
    console.log("Buttons loves you");

    // button indexing
    this.index = buildIndex(this.app);

    this.registerEvent(
      this.app.metadataCache.on("changed", () => {
        console.log("metadata changed");
        this.index = buildIndex(this.app);
      })
    );

    this.registerEditorExtension(this.buttonPlugin(this));

    this.registerMarkdownCodeBlockProcessor("button", (source, el) => {
      const args = createArgs(source);
      const onClick = createOnclick(args, this.app, this.index);
      button(el, args.name, onClick);
    });
  }

  inlineButtons(view: EditorView, index: ButtonCache[]) {
    const buttons: Range<Decoration>[] = [];

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter: (type, from, to) => {
          if (type.name == "inline-code") {
            const selection = view.state.selection;
            if (
              (selection && selection.main.to < to + 1) &&
              selection.main.from > from - 1
            ) {
              return;
            }
            const text = view.state.doc.sliceString(from, to);
            if (text.match(/button-[\d\w]{1,6}/)) {
              const id = text.split("-")[1];
              const button = index.find((b) => b.id == id);
              if (button) {
                const onClick = createOnclick(
                  button.args,
                  this.app,
                  this.index
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

  buttonPlugin(plugin: Buttons) {
    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          this.decorations = plugin.inlineButtons(view, plugin.index);
        }

        update(update: ViewUpdate): void {
          this.decorations = plugin.inlineButtons(update.view, plugin.index);
        }
      },
      {
        decorations: (v) => v.decorations,
      }
    );
  }
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
