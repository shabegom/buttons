import { App, MarkdownView, Notice } from "obsidian";
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
import { getButtonPosition, getInlineButtonPosition } from "./parser";
import { 
  command, 
  copy, 
  link, 
  template, 
  calculate, 
  text, 
  swap, 
  remove,
  replace
} from "./buttonTypes";

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
      enter: ({ node }: any) => {
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
            const line = view.state.doc.lineAt(node.to).number;
            const el = createEl("button");
            el.addClass("button-default");
            const deco = Decoration.replace({
              widget: new ButtonWidget(el, id, app, line),
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
    readonly app: App,
    readonly line: number
  ) {
    super();
  }

  eq(other: ButtonWidget): boolean {
    return other.id === this.id;
  }

  toDOM(): HTMLElement {
    // Asynchronously get the button data and set up the button
    getButtonById(this.app, this.id).then((args) => {
      if (args) {
        const name = args.name;
        const className = args.class;
        const color = args.color;
        
        // Update the button element with the proper styling
        this.el.innerText = name || "";
        if (className) {
          this.el.addClass(className);
          this.el.removeClass("button-default");
        }
        if (color) {
          this.el.addClass(color);
        }
        
        // Set up the click handler by directly implementing the click handler logic
        this.el.onclick = async () => {
          // Replicate the clickHandler logic from button.ts
          const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
          const activeFile = activeView?.file || this.app.workspace.getActiveFile();
          
          if (!activeFile) {
            new Notice("No active file found. Buttons can only be used with files.");
            return;
          }
          
          let content = await this.app.vault.read(activeFile);
          const buttonStart = getButtonPosition(content, args);
          let position = await getInlineButtonPosition(this.app, this.id);
          
          if (args.replace) {
            replace(this.app, args);
          }

          if (args.type && args.type.includes("command")) {
            command(this.app, args, buttonStart);
          }
          if (args.type === "copy") {
            copy(args);
          }
          // handle link buttons
          if (args.type === "link") {
            link(args);
          }
          // handle template buttons
          if (args.type && args.type.includes("template")) {
            content = await this.app.vault.read(activeFile);
            position = await getInlineButtonPosition(this.app, this.id);
            await template(this.app, args, position);
          }
          if (args.type === "calculate") {
            await calculate(this.app, args, position);
          }
          if (args.type && args.type.includes("text")) {
            content = await this.app.vault.read(activeFile);
            position = await getInlineButtonPosition(this.app, this.id);
            await text(this.app, args, position);
          }
          if (args.swap) {
            await swap(this.app, args.swap, this.id, true, activeFile, buttonStart);
          }
          // handle removing the button
          if (args.remove) {
            content = await this.app.vault.read(activeFile);
            position = await getInlineButtonPosition(this.app, this.id);
            await remove(this.app, args, position);
          }
        };
      } else {
        this.el.innerText = "button not found. check button ID";
        this.el.removeClass("button-default");
        this.el.addClass("button-error");
      }
    });
    
    return this.el;
  }
}

export default buttonPlugin; 