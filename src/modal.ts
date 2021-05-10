import { Modal, App, Setting, MarkdownView, Editor } from "obsidian";
import { createButton } from "./button";
import { CommandSuggest, TemplateSuggest, ButtonSuggest } from "./suggest";

export class ButtonModal extends Modal {
  activeView: MarkdownView;
  activeEditor: Editor;
  activeCursor: CodeMirror.Position;
  actionInterval: Timeout;
  buttonPreviewEl: HTMLElement = createEl("p");
  commandSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  fileSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  removeSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  swapSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  idSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  removeSuggest;
  swapSuggest;
  idSuggest;
  commandSuggest;
  fileSuggest;

  constructor(app: App) {
    super(app);
    this.activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (this.activeView) {
      this.activeEditor = this.activeView.editor;
      this.activeCursor = this.activeEditor.getCursor();
    }
    this.commandSuggest = new CommandSuggest(this.app, this.commandSuggestEl);
    this.commandSuggestEl.placeholder = "Toggle Pin";
    this.fileSuggest = new TemplateSuggest(this.app, this.fileSuggestEl);
    this.fileSuggestEl.placeholder = "My Template";
    this.removeSuggest = new ButtonSuggest(this.app, this.removeSuggestEl);
    this.removeSuggestEl.value = "true";
    this.swapSuggest = new ButtonSuggest(this.app, this.swapSuggestEl);
    this.idSuggest = new ButtonSuggest(this.app, this.idSuggestEl);
    this.swapSuggestEl.placeholder = "[idOne, idTwo]";
  }

  onOpen() {
    const { titleEl, contentEl } = this;
    titleEl.setText("Button Maker");
    contentEl.createEl("form", {}, (formEl) => {
      new Setting(formEl)
        .setName("Button Name")
        .setDesc("What would you like to call this button?")
        .addText((textEl) => {
          textEl.setPlaceholder("My Awesome Button");
          textEl.onChange((value) => {
            this.buttonPreviewEl.setText(value);
          });

          window.setTimeout(() => textEl.inputEl.focus(), 10);
        });
      new Setting(formEl)
        .setName("Button Type")
        .setDesc("What type of button?")
        .addDropdown((drop) => {
          drop.addOption("pre", "Select a Button Type");
          drop.addOption("command", "Command - run a command prompt command");
          drop.addOption("link", "Link - open a url or uri");
          drop.addOption(
            "calculate",
            "Calculate - run a mathematical calculation"
          );
          drop.addOption(
            "prepend template",
            "Prepend Template - prepend a template in the current note"
          );
          drop.addOption(
            "append template",
            "Append Template - append a template in the current note"
          );
          drop.addOption(
            "note template",
            "New Note from Template - create a new note from a template"
          );
          drop.addOption(
            "swap",
            "Swap - Create a multi-purpose Inline Button from other Buttons"
          );
          const action = formEl.createEl("div");
          drop.onChange((value) => {
            if (value === "link") {
              action.empty();
              new Setting(action)
                .setName("Link")
                .setDesc("Enter a link to open")
                .addText((textEl) => {
                  textEl.setPlaceholder("https://obsidian.md");
                });
            }
            if (value === "command") {
              action.empty();
              new Setting(action)
                .setName("Command")
                .setDesc("Enter a command to run")
                .addText((textEl) => {
                  textEl.inputEl.replaceWith(this.commandSuggestEl);
                });
            }
            if (value.includes("template")) {
              action.empty();
              new Setting(action)
                .setName("Template")
                .setDesc("Select a template note")
                .addText((textEl) => {
                  textEl.inputEl.replaceWith(this.fileSuggestEl);
                });
            }
            if (value === "calculate") {
              action.empty();
              new Setting(action)
                .setName("Calculate")
                .setDesc(
                  "Enter a calculation, you can reference a line number with $LineNumber"
                )
                .addText((textEl) => {
                  textEl.setPlaceholder("2+$10");
                });
            }
            if (value === "swap") {
              action.empty();
              new Setting(action)
                .setName("Swap")
                .setDesc(
                  "choose buttons to be included in the Inline Swap Button"
                )
                .addText((textEl) => {
                  textEl.inputEl.replaceWith(this.swapSuggestEl);
                });
            }
          });
        });
      new Setting(formEl)
        .setName("Remove")
        .setDesc(
          "Would you like to remove this button (or other buttons) after clicking?"
        )
        .addToggle((toggleEl) => {
          toggleEl.onChange((value) => {
            if (value) {
              new Setting(remove)
                .setName("Select Remove")
                .setDesc(
                  "Use true to remove this button, or supply an [array] of button block-ids"
                )
                .addText((textEl) => {
                  textEl.inputEl.replaceWith(this.removeSuggestEl);
                });
            }
            if (!value) {
              remove.empty();
            }
          });
        });
      const remove = formEl.createEl("div");
      new Setting(formEl)
        .setName("Replace")
        .setDesc("Would you like to replace lines in the note after clicking?")
        .addToggle((toggleEl) => {
          toggleEl.onChange((value) => {
            if (value) {
              new Setting(replace)
                .setName("Select Lines")
                .setDesc(
                  "Supply an array of [startingLine, endingLine] to be replaced"
                )
                .addText((textEl) => {
                  textEl.setValue("[]");
                });
            }
            if (!value) {
              replace.empty();
            }
          });
        });
      const replace = formEl.createEl("div");
      new Setting(formEl)
        .setName("Inherit")
        .setDesc(
          "Would you like to inherit args by adding an existing button block-id?"
        )
        .addToggle((toggleEl) => {
          toggleEl.onChange((value) => {
            if (value) {
              new Setting(id)
                .setName("id")
                .setDesc(
                  "inherit from other Buttons by adding their button block-id"
                )
                .addText((textEl) => {
                  textEl.inputEl.replaceWith(this.idSuggestEl);
                  textEl.onChange((value) => {
                    this.buttonPreviewEl.setAttribute("id", value);
                  });
                });
            }
            if (!value) {
              id.empty();
            }
          });
        });
      const id = formEl.createEl("div");
      new Setting(formEl)
        .setName("Templater")
        .setDesc(
          "Do you want to convert a templater command inside your Button on each click?"
        )
        .addToggle((toggleEl) => {
          toggleEl.setTooltip("Do not use for inline Button");
        });
      new Setting(formEl)
        .setName("Custom Class")
        .setDesc("Add a custom class for button styling")
        .addText((textEl) => {
          textEl.onChange((value) => {
            this.buttonPreviewEl.setAttribute("class", value);
          });
        });
      new Setting(formEl)
        .setName("Color")
        .setDesc("What color would you like your button to be?")
        .addDropdown((drop) => {
          drop.addOption("default", "Default Color");
          drop.addOption("blue", "Blue");
          drop.addOption("red", "Red");
          drop.addOption("green", "Green");
          drop.addOption("yellow", "Yellow");
          drop.addOption("purple", "Purple");
          drop.onChange((value) => {
            const buttonClass = this.buttonPreviewEl
              .getAttribute("class")
              .replace(" blue", "")
              .replace(" red", "")
              .replace(" green", "")
              .replace(" yellow", "")
              .replace(" purple", "");
            if (value !== "default") {
              this.buttonPreviewEl.setAttribute(
                "class",
                `${buttonClass} ${value}`
              );
              if (value === "blue") {
                value = "#76b3fa";
              }
              if (value === "purple") {
                value = "#725585";
              }
              this.buttonPreviewEl.setAttribute(
                "style",
                `background: ${value}`
              );
            } else {
              this.buttonPreviewEl.setAttribute("class", `${buttonClass}`);
              this.buttonPreviewEl.removeAttribute("style");
            }
          });
        });
      formEl.createDiv("modal-button-container", (buttonContainerEl) => {
        buttonContainerEl
          .createEl("button", { attr: { type: "button" }, text: "Cancel" })
          .addEventListener("click", () => this.close());
        buttonContainerEl.createEl("button", {
          attr: { type: "submit" },
          cls: "mod-cta",
          text: "Insert Button",
        });
      });

      formEl.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        console.log(formEl.target.valueOf());
        this.close();
      });
    });
    contentEl.createEl("p").setText("Button Preview");
    this.buttonPreviewEl = createButton(
      this.app,
      contentEl,
      { name: "My Awesome Button" },
      false
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
