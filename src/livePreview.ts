import { App, MarkdownView, Notice, MarkdownRenderer } from "obsidian";
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
import { getInlineButtonPosition } from "./parser";
import { 
  command, 
  copy, 
  link, 
  template, 
  calculate, 
  text, 
  swap, 
  remove,
  replace,
  chain
} from "./buttonTypes";
import templater from "./templater";

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
    // Initialize the button element with default state immediately
    this.el.innerText = "Loading...";
    this.el.addClass("button-default");
    
    // Asynchronously get the button data and update the element content
    this.loadButtonData();
    
    return this.el;
  }

  private async loadButtonData(): Promise<void> {
    try {
      const args = await getButtonById(this.app, this.id);
      
      if (args) {
        const name = args.name;
        const className = args.class;
        const color = args.color;
        
        this.el.innerHTML = ""; // Clear existing content
          
        MarkdownRenderer.render(
          this.app,
          args.name,
          this.el,
          this.app.workspace.getActiveFile()?.path || "",
          null
        );
      
        // Changing the button's innerHTML to be wrapped in a div rather than a p so that it is not on a new line
        // Style tags so the user can set the width, height, and alignment of the button
      
        let numberOfLines = args.name.split('\n').length;
        let paddingTop = 'auto';
        let paddingBottom = 'auto';
      
        let alignment = args.align?.split(' ') || ['center', 'middle'];
      
        if (args.height) {
      
          if (alignment.includes("top")) {
            alignment = alignment.filter((a: string) => a !== "top");
            paddingBottom = (parseFloat(args.height) - 1.2 * numberOfLines) + "em";
          } else if (alignment.includes("bottom")) {
            alignment = alignment.filter((a: string) => a !== "bottom");
            paddingTop = (parseFloat(args.height) - 1.2 * numberOfLines) + "em";
          } else {
            alignment = alignment.filter((a: string) => a !== "middle");
            paddingTop = (parseFloat(args.height) - 1.2 * numberOfLines) / 2 + "em";
            paddingBottom = (parseFloat(args.height) - 1.2 * numberOfLines) / 2 + "em";
          }
      
        }
      
        if (args.width) {
          args.width += "em";
        } else {
          args.width = "auto";
        }
      
        this.el.innerHTML = "<div style='" + 
          `width: ${args.width};` + 
          `padding-top: ${paddingTop};` + 
          `padding-bottom: ${paddingBottom};` + 
          `text-align: ${alignment[0] || 'center'};` + 
          'line-height: 1.2em;' +
          `'>${this.el.innerHTML.slice(14, -4)}</div>`;
        
        
        // Update classes - keep button-default and add custom classes
        if (className) {
          this.el.addClass(className);
        }
        if (color) {
          this.el.addClass(color);
        }
        
        // Set up the click handler
        this.el.onclick = async () => {
          await this.handleButtonClick(args);
        };
      } else {
        this.el.innerText = "button not found. check button ID";
        this.el.removeClass("button-default");
        this.el.addClass("button-error");
      }
    } catch (error) {
      // Handle any errors in loading button data
      this.el.innerText = "Error loading button";
      this.el.removeClass("button-default");
      this.el.addClass("button-error");
    }
  }

  private async handleButtonClick(args: any): Promise<void> {
    // Replicate the clickHandler logic from button.ts
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const activeFile = activeView?.file || this.app.workspace.getActiveFile();
    
    if (!activeFile) {
      new Notice("No active file found. Buttons can only be used with files.");
      return;
    }
    
    // Process templater commands for inline buttons only
    if (args.templater && args.action && args.action.includes("<%")) {
      try {
        // Both template and target are activeFile since we're processing templater commands within the same file
        const runTemplater = await templater(this.app, activeFile, activeFile);
        if (runTemplater) {
          args.action = await runTemplater(args.action);
        }
      } catch (error) {
        console.error('Error processing templater in inline button:', error);
        new Notice("Error processing templater in inline button. Check console for details.", 2000);
      }
    }
    
    const buttonStart = await getInlineButtonPosition(this.app, this.id);
    let position = await getInlineButtonPosition(this.app, this.id);
    
    if (args.replace) {
      await replace(this.app, args, position);
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
      position = await getInlineButtonPosition(this.app, this.id);
      await template(this.app, args, position);
    }
    if (args.type === "calculate") {
      await calculate(this.app, args, position);
    }
    if (args.type && args.type.includes("text")) {
      position = await getInlineButtonPosition(this.app, this.id);
      await text(this.app, args, position);
    }
    if (args.swap) {
      await swap(this.app, args.swap, this.id, true, activeFile, buttonStart);
    }
    // handle removing the button
    if (args.remove) {
      position = await getInlineButtonPosition(this.app, this.id);
      await remove(this.app, args, position);
    }
    if (args.type === "chain") {
      await chain(this.app, args, position, true, this.id, activeFile);
      return;
    }
  }
}

export default buttonPlugin; 