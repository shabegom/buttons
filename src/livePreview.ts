import { App } from "obsidian";
import { getButtonById } from "./buttonStore";
import { createButton } from "./button";

// Extend the window object to include CodeMirror
declare global {
  interface Window {
    CodeMirror?: any;
  }
}

/**
 * Create a CM6 extension for inline button rendering
 * This uses Obsidian's internal CM6 instance to avoid conflicts
 */
function buttonPlugin(app: App): any {
  // Use Obsidian's internal CM6 modules
  const CM6 = (window as any).CodeMirror;
  if (!CM6) {
    console.warn('Buttons: CM6 not available, falling back to post-processor only');
    return [];
  }

  const { EditorView, ViewPlugin, Decoration, WidgetType } = CM6.view || {};
  
  if (!EditorView || !ViewPlugin || !Decoration || !WidgetType) {
    console.warn('Buttons: CM6 view modules not available, falling back to post-processor only');
    return [];
  }

  const { syntaxTree } = CM6.language || {};
  const { EditorSelection } = CM6.state || {};

  if (!syntaxTree || !EditorSelection) {
    console.warn('Buttons: CM6 language/state modules not available');
    return [];
  }

  // Check if selection and range overlap
  function selectionAndRangeOverlap(selection: any, rangeFrom: number, rangeTo: number): boolean {
    for (const range of selection.ranges) {
      if (range.from <= rangeTo && range.to >= rangeFrom) {
        return true;
      }
    }
    return false;
  }

  function inlineButtons(view: any) {
    const regex = new RegExp(".*?_?inline-code_?.*");
    const selection = view.state.selection;
    const buttons: any[] = [];
    
    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter: ({ node }: any) => {
          const content = view.state.doc.sliceString(node.from, node.to);
          // Don't render if cursor is near the inline code
          if (selectionAndRangeOverlap(selection, node.from - 1, node.to + 1)) {
            return;
          }
          if (node.type.name.includes("formatting")) return;
          if (regex.test(node.type.name)) {
            const matches = content.match(/button-([\s\S]*)/);
            const id = matches && matches[1] ? matches[1] : "";
            if (id) {
              const el = document.createElement("span");
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

  class ButtonWidget extends WidgetType {
    constructor(
      readonly el: HTMLElement,
      readonly id: string,
      readonly app: App
    ) {
      super();
    }

    eq(other: any): boolean {
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

  return ViewPlugin.fromClass(
    class {
      decorations: any;

      constructor(view: any) {
        this.decorations = inlineButtons(view);
      }

      update(update: any): void {
        this.decorations = inlineButtons(update.view);
      }
    },
    {
      decorations: (v: any) => v.decorations,
    }
  );
}

export default buttonPlugin; 