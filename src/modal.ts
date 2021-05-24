import { Modal, App, Setting, MarkdownView, Editor } from "obsidian";
import { createButton } from "./button";
import { CommandSuggest, TemplateSuggest, ButtonSuggest } from "./suggest";
import { insertButton, insertInlineButton } from "./utils";

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
    this.commandSuggest = new CommandSuggest(this.app, this.commandSuggestEl);
    this.commandSuggestEl.placeholder = "Toggle Pin";
    this.commandSuggestEl.addEventListener("change", (e: Event) => {
      this.outputObject.action = (<HTMLInputElement>e.target).value;
    });
    this.commandSuggestEl.addEventListener("blur", (e: Event) => {
      this.outputObject.action = (<HTMLInputElement>e.target).value;
    });
    this.fileSuggest = new TemplateSuggest(this.app, this.fileSuggestEl);
    this.fileSuggestEl.placeholder = "My Template";
    this.fileSuggestEl.addEventListener("change", (e) => {
      this.outputObject.action = (<HTMLInputElement>e.target).value;
    });
    this.fileSuggestEl.addEventListener("blur", (e) => {
      this.outputObject.action = (<HTMLInputElement>e.target).value;
    });
    this.removeSuggest = new ButtonSuggest(this.app, this.removeSuggestEl);
    this.removeSuggestEl.value = "true";
    this.removeSuggestEl.addEventListener("change", (e) => {
      this.outputObject.remove = (<HTMLInputElement>e.target).value;
    });
    this.removeSuggestEl.addEventListener("blur", (e) => {
      this.outputObject.remove = (<HTMLInputElement>e.target).value;
    });
    this.swapSuggest = new ButtonSuggest(this.app, this.swapSuggestEl);
    this.swapSuggestEl.addEventListener("change", (e) => {
      this.outputObject.swap = (<HTMLInputElement>e.target).value;
    });
    this.swapSuggestEl.addEventListener("blur", (e) => {
      this.outputObject.swap = (<HTMLInputElement>e.target).value;
    });
    this.idSuggest = new ButtonSuggest(this.app, this.idSuggestEl);
    this.idSuggestEl.addEventListener("change", (e) => {
      this.outputObject.id = (<HTMLInputElement>e.target).value;
    });
    this.idSuggestEl.addEventListener("blur", (e) => {
      this.outputObject.id = (<HTMLInputElement>e.target).value;
    });
    this.swapSuggestEl.placeholder = "[idOne, idTwo]";
  }

  private outputObject = {
    name: "",
    type: "",
    action: "",
    swap: "",
    remove: "",
    replace: "",
    id: "",
    templater: false,
    class: "",
    color: "",
    blockId: "",
  };

  onOpen(): void {
    const { titleEl, contentEl } = this;
    titleEl.setText("Button Maker");
    contentEl.addClass("button-maker");
    contentEl.createEl("form", {}, (formEl) => {
      new Setting(formEl)
        .setName("Button Name")
        .setDesc("What would you like to call this button?")
        .addText((textEl) => {
          textEl.setPlaceholder("My Awesome Button");
          textEl.onChange((value) => {
            this.buttonPreviewEl.setText(value);
            this.outputObject.name = value;
          });

          window.setTimeout(() => textEl.inputEl.focus(), 10);
        });
      const typeContainer = createEl("div");
      const typeTitle = createEl("span", { cls: "setting-item-title" });
      typeTitle.setText("Button Type");
      const typeDesc = createEl("div", { cls: "setting-item-description" });
      typeDesc.setText("What type of button are you making?");
      formEl.appendChild(typeContainer);
      typeContainer.appendChild(typeTitle);
      typeContainer.appendChild(typeDesc);
      new Setting(typeDesc).addDropdown((drop) => {
        drop.addOption("pre", "Select a Button Type");
        drop.addOption("command", "Command - run a command prompt command");
        drop.addOption("link", "Link - open a url or uri");
        drop.addOption(
          "template",
          "Template - insert or create notes from templates"
        );
        drop.addOption("text", "Text - insert or create notes with text");
        drop.addOption(
          "calculate",
          "Calculate - run a mathematical calculation"
        );
        drop.addOption(
          "swap",
          "Swap - Create a multi-purpose Inline Button from other Buttons"
        );
        const action = formEl.createEl("div");
        drop.onChange((value) => {
          this.outputObject.type = value;
          if (value === "link") {
            action.empty();
            new Setting(action)
              .setName("Link")
              .setDesc("Enter a link to open")
              .addText((textEl) => {
                textEl.setPlaceholder("https://obsidian.md");
                textEl.onChange((value) => (this.outputObject.action = value));
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
              .setDesc("Select a template note and what should happen")
              .addDropdown((drop) => {
                drop.addOption("pre", "Do this...");
                drop.addOption("prepend template", "Prepend");
                drop.addOption("append template", "Append");
                drop.addOption("line template", "Line");
                drop.addOption("note template", "Note");
                drop.onChange((value) => {
                  this.outputObject.type = value;
                  if (value == "line template") {
                    new Setting(action)
                      .setName("Line Number")
                      .setDesc("At which line should the template be inserted?")
                      .addText((textEl) => {
                        textEl.setPlaceholder("69");
                        textEl.onChange((value) => {
                          this.outputObject.type = `line(${value}) template`;
                        });
                      });
                  }
                  if (value == "note template") {
                    new Setting(action)
                      .setName("Note Name")
                      .setDesc("What should the new note be named?")
                      .addText((textEl) => {
                        textEl.setPlaceholder("My New Note");
                        new Setting(action)
                          .setName("Split")
                          .setDesc("Should the new note open in a split pane?")
                          .addToggle((toggleEl) => {
                            this.outputObject.type = `note(${textEl.getValue}) template`;
                            textEl.onChange((textVal) => {
                              const toggleVal = toggleEl.getValue();
                              if (toggleVal) {
                                this.outputObject.type = `note(${textVal}, split) template`;
                              }
                              if (!toggleVal) {
                                this.outputObject.type = `note(${textVal}) template`;
                              }
                            });
                            toggleEl.onChange((toggleVal) => {
                              const textVal = textEl.getValue();
                              if (toggleVal) {
                                this.outputObject.type = `note(${textVal}, split) template`;
                              }
                              if (!toggleVal) {
                                this.outputObject.type = `note(${textVal}) template`;
                              }
                            });
                          });
                      });
                  }
                });
              })
              .addText((textEl) => {
                textEl.inputEl.replaceWith(this.fileSuggestEl);
              });
          }
          if (value.includes("text")) {
            action.empty();
            new Setting(action)
              .setName("Text")
              .setDesc("What text and where should it go?")
              .addDropdown((drop) => {
                drop.addOption("pre", "Do this...");
                drop.addOption("prepend text", "Prepend");
                drop.addOption("append text", "Append");
                drop.addOption("line text", "Line");
                drop.addOption("note text", "Note");
                drop.onChange((value) => {
                  this.outputObject.type = value;
                  if (value == "line text") {
                    new Setting(action)
                      .setName("Line Number")
                      .setDesc("At which line should the template be inserted?")
                      .addText((textEl) => {
                        textEl.setPlaceholder("69");
                        textEl.onChange((value) => {
                          this.outputObject.type = `line(${value}) text`;
                        });
                      });
                  }
                  if (value == "note text") {
                    new Setting(action)
                      .setName("Note Name")
                      .setDesc("What should the new note be named?")
                      .addText((textEl) => {
                        textEl.setPlaceholder("My New Note");
                        new Setting(action)
                          .setName("Split")
                          .setDesc("Should the new note open in a split pane?")
                          .addToggle((toggleEl) => {
                            this.outputObject.type = `note(${textEl.getValue}) text`;
                            textEl.onChange((textVal) => {
                              const toggleVal = toggleEl.getValue();
                              if (toggleVal) {
                                this.outputObject.type = `note(${textVal}, split) text`;
                              }
                              if (!toggleVal) {
                                this.outputObject.type = `note(${textVal}) text`;
                              }
                            });
                            toggleEl.onChange((toggleVal) => {
                              const textVal = textEl.getValue();
                              if (toggleVal) {
                                this.outputObject.type = `note(${textVal}, split) text`;
                              }
                              if (!toggleVal) {
                                this.outputObject.type = `note(${textVal}) text`;
                              }
                            });
                          });
                      });
                  }
                });
              })
              .addText((textEl) => {
                textEl.setPlaceholder("My Text to Insert");
                textEl.onChange((value) => {
                  this.outputObject.action = value;
                });
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
                textEl.onChange((value) => (this.outputObject.action = value));
              });
          }
          if (value === "swap") {
            this.outputObject.type = "";
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
        .setName("Button Block ID")
        .setDesc("Provide a custom button-block-id")
        .addText((textEl) => {
          textEl.setPlaceholder("buttonId");
          textEl.onChange((value) => {
            this.outputObject.blockId = value;
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
              this.outputObject.remove = "";
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
                  textEl.onChange(
                    (value) => (this.outputObject.replace = value)
                  );
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
                });
            }
            if (!value) {
              this.outputObject.replace = "";
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
          toggleEl.onChange((value) => {
            this.outputObject.templater = value;
          });
        });
      new Setting(formEl)
        .setName("Custom Class")
        .setDesc("Add a custom class for button styling")
        .addText((textEl) => {
          textEl.onChange((value) => {
            this.buttonPreviewEl.setAttribute("class", value);
            this.outputObject.class = value;
            if (value === "") {
              this.buttonPreviewEl.setAttribute("class", "button-default");
            }
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
            this.outputObject.color = value;
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
          .createEl("button", {
            attr: { type: "button" },
            cls: "button-default",
            text: "Cancel",
          })
          .addEventListener("click", () => this.close());
        buttonContainerEl.createEl("button", {
          attr: { type: "submit" },
          cls: "button-default mod-cta",
          text: "Insert Button",
        });
      });

      formEl.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        insertButton(this.app, this.outputObject);
        this.close();
      });
    });
    contentEl.createEl("p").setText("Button Preview");
    this.buttonPreviewEl = createButton({
      app: this.app,
      el: contentEl,
      args: { name: "My Awesome Button" },
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class InlineButtonModal extends Modal {
  buttonSuggestEl: HTMLInputElement = createEl("input", { type: "text" });
  buttonSuggest;

  constructor(app: App) {
    super(app);
    this.buttonSuggest = new ButtonSuggest(this.app, this.buttonSuggestEl);
    this.buttonSuggestEl.setAttribute("style", "width: 100%; height: 40px");
  }

  onOpen() {
    const { titleEl, contentEl } = this;
    titleEl.setText("Insert Inline Button");
    contentEl.createEl("form", {}, (formEl) => {
      formEl.appendChild(this.buttonSuggestEl);
      formEl.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        insertInlineButton(this.app, this.buttonSuggestEl.value);
        this.close();
      });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
