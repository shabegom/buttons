import { Modal, App, Setting, MarkdownView, Editor } from "obsidian";
import { createButton } from "./button";
import { CommandSuggest, TemplateSuggest, ButtonSuggest } from "./suggest";
import { insertButton, insertInlineButton } from "./utils";

export class ButtonModal extends Modal {
  activeView: MarkdownView;
  activeEditor: Editor;
  activeCursor: CodeMirror.Position;
  // actionInterval: Timeout;
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
    name: "My Awesome Button",
    type: "",
    action: "",
    swap: "",
    remove: "",
    replace: "",
    id: "",
    templater: false,
    class: "",
    color: "",
    customColor: "",
    customTextColor: "",
    blockId: "",
    folder: "",
    prompt: false,
    actions: [] as { type: string; action: string }[], // Add type annotation
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
        drop.addOption("copy", "Text - Copy text to clipboard");
        drop.addOption("chain", "Chain - Run multiple actions in sequence");
        const action = formEl.createEl("div");
        drop.onChange((value) => {
          this.outputObject.type = value;
          if (value === "chain") {
            action.empty();
            // Chain actions UI
            if (!Array.isArray(this.outputObject.actions)) {
              this.outputObject.actions = [];
            }
            const actionsList = action.createEl("div", { cls: "chain-actions-list" });
            actionsList.setAttribute("style", "margin-top: 10px;");
            const actionsTitle = actionsList.createEl("h4", { text: "Chain Actions" });
            actionsTitle.setAttribute("style", "margin: 0 0 10px 0; color: var(--text-normal);");
            const actionsDesc = actionsTitle.createEl("div", { text: "Add actions to be executed in sequence" });
            actionsDesc.setAttribute("style", "font-size: 12px; color: var(--text-muted); font-weight: normal;");
            const renderActions = () => {
              actionsList.empty();
              actionsList.appendChild(actionsTitle);
              this.outputObject.actions.forEach((act, idx) => {
                const actionRow = actionsList.createEl("div", { cls: "chain-action-row" });
                actionRow.setAttribute("style", "border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 12px; margin-bottom: 8px; background: var(--background-secondary);");
                const actionHeader = actionRow.createEl("div");
                actionHeader.setAttribute("style", "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;");
                const actionNumber = actionHeader.createEl("span", { text: `Action ${idx + 1}` });
                actionNumber.setAttribute("style", "font-weight: 600; color: var(--text-normal);");
                // Type dropdown
                const typeSelect = actionRow.createEl("select");
                typeSelect.setAttribute("style", "margin-right: 8px; flex: 1;");
                // Add all the button type options
                const typeOptions = [
                  { value: "command", text: "Command" },
                  { value: "append text", text: "Append Text" },
                  { value: "prepend text", text: "Prepend Text" },
                  { value: "line text", text: "Line Text" },
                  { value: "note text", text: "Note Text" },
                  { value: "append template", text: "Append Template" },
                  { value: "prepend template", text: "Prepend Template" },
                  { value: "line template", text: "Line Template" },
                  { value: "note template", text: "Note Template" },
                  { value: "link", text: "Link" },
                  { value: "calculate", text: "Calculate" },
                  { value: "copy", text: "Copy" }
                ];
                typeOptions.forEach(opt => {
                  const option = typeSelect.createEl("option");
                  option.value = opt.value;
                  option.text = opt.text;
                  if (act.type === opt.value) option.selected = true;
                });
                typeSelect.onchange = () => {
                  this.outputObject.actions[idx].type = typeSelect.value;
                  // Clear and rebuild the action input based on type
                  actionInputContainer.empty();
                  this.renderActionInput(actionInputContainer, idx, typeSelect.value);
                };
                // Action input container
                const actionInputContainer = actionRow.createEl("div", { cls: "action-input-container" });
                actionInputContainer.setAttribute("style", "margin-top: 8px;");
                this.renderActionInput(actionInputContainer, idx, act.type);
                // Remove button
                const removeBtn = actionRow.createEl("button", { type: "button" });
                removeBtn.setAttribute("style", "background: var(--background-modifier-error); color: var(--text-on-accent); border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;");
                removeBtn.textContent = "× Remove";
                removeBtn.onclick = (event) => {
                  event.preventDefault();
                  this.outputObject.actions.splice(idx, 1);
                  renderActions();
                };
              });
            };
            // Add action button
            const addActionBtn = action.createEl("button", { type: "button" });
            addActionBtn.setAttribute("style", "background: var(--interactive-accent); color: var(--text-on-accent); border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; margin-top: 8px;");
            addActionBtn.textContent = "+ Add Action";
            addActionBtn.onclick = (event) => {
              event.preventDefault();
              this.outputObject.actions.push({ type: "command", action: "" });
              renderActions();
            };
            renderActions();
          }
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
              .addDropdown((drop) => {
              drop.addOption("command", "Default");
              drop.addOption("prepend command", "Prepend");
              drop.addOption("append command", "Append");
              drop.onChange((value) => {
                this.outputObject.type = value;
              })
              })
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
                      .setName("Prompt")
                      .setDesc(
                        "Should you be prompted to enter a name for the file on creation?"
                      )
                      .addToggle((toggleEl) => {
                        this.outputObject.prompt = false;
                        toggleEl.onChange(
                          (bool) => (this.outputObject.prompt = bool)
                        );
                      });
                    new Setting(action)
                      .setName("Note Name")
                      .setDesc(
                        "What should the new note be named? Note: if prompt is on, this will be the default name"
                      )
                      .addText((textEl) => {
                        textEl.setPlaceholder("My New Note");
                        new Setting(action)
                          .setName("Default Folder")
                          .setDesc(
                            "Enter a folder path to place the note in. Defaults to root"
                          )
                          .addText((textEl) => {
                            this.outputObject.folder = "";
                            textEl.onChange((textVal) => {
                              this.outputObject.folder = textVal;
                            });
                          });
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
          if(value === "copy") {
            action.empty();
            new Setting(action)
              .setName("Text")
              .setDesc("Text to copy for clipboard")
              .addText((textEl) => {
                textEl.setPlaceholder("Text to copy");
                textEl.onChange((value) => (this.outputObject.action = value));
              })
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
                this.outputObject.remove = "true";
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
          drop.addOption("custom", "Custom")
          drop.onChange((value) => {
            customBackgroundColor.empty()
            customTextColor.empty()
            if(value === 'custom') {
              this.outputObject.color = "";
              new Setting(customBackgroundColor)
                .setName("Background: ")
                .addText((el) => {
                  el.setPlaceholder("#FFFFFF");
                  el.onChange((value: string) => {
                    // Preserve custom classes when setting custom background
                    const currentClasses = this.buttonPreviewEl.className.split(' ').filter(cls => 
                      cls !== 'button-default' && !['blue', 'red', 'green', 'yellow', 'purple'].includes(cls)
                    );
                    this.buttonPreviewEl.className = currentClasses.join(' ');
                    this.buttonPreviewEl.style.background = value;
                    this.outputObject.customColor = value;
                  });
              })
              new Setting(customTextColor)
              .setName("Text Color: ")
                .addText((el) => {
                  el.setPlaceholder("#000000");
                  el.onChange((value: string) => {
                    // Preserve custom classes when setting custom text color
                    const currentClasses = this.buttonPreviewEl.className.split(' ').filter(cls => 
                      cls !== 'button-default' && !['blue', 'red', 'green', 'yellow', 'purple'].includes(cls)
                    );
                    this.buttonPreviewEl.className = currentClasses.join(' ');
                    this.buttonPreviewEl.style.color = value;
                    this.outputObject.customTextColor = value;
                  });
                });
              return
            }
            this.outputObject.color = value;
            if (value !== "default") {
              // Preserve custom classes when setting color
              const currentClasses = this.buttonPreviewEl.className.split(' ').filter(cls => 
                cls !== 'button-default' && !['blue', 'red', 'green', 'yellow', 'purple'].includes(cls)
              );
              this.buttonPreviewEl.setAttribute(
                "class",
                `button-default ${value} ${currentClasses.join(' ')}`.trim()
              );
              this.buttonPreviewEl.removeAttribute("style");
            } else {
              // Preserve custom classes when setting default color
              const currentClasses = this.buttonPreviewEl.className.split(' ').filter(cls => 
                cls !== 'button-default' && !['blue', 'red', 'green', 'yellow', 'purple'].includes(cls)
              );
              this.buttonPreviewEl.setAttribute("class", `button-default ${currentClasses.join(' ')}`.trim());
              this.buttonPreviewEl.removeAttribute("style");
            }
          });
        });

      const customBackgroundColor = formEl.createEl("div");
      const customTextColor = formEl.createEl("div");

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

  private renderActionInput(container: HTMLElement, actionIndex: number, actionType: string): void {
    
    if (actionType.includes("line text") || actionType.includes("line template")) {
      // Line number input
      new Setting(container)
        .setName("Line Number")
        .setDesc("At which line should this be inserted?")
        .addText((textEl) => {
          textEl.setPlaceholder("69");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].type = `line(${value}) ${actionType.includes("text") ? "text" : "template"}`;
          });
        });
      // Content input
      new Setting(container)
        .setName("Content")
        .setDesc(actionType.includes("text") ? "Text to insert" : "Template to insert")
        .addText((textEl) => {
          textEl.setPlaceholder(actionType.includes("text") ? "My Text to Insert" : "My Template");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    } else if (actionType.includes("note text") || actionType.includes("note template")) {
      // Note name input
      new Setting(container)
        .setName("Note Name")
        .setDesc("What should the new note be named?")
        .addText((textEl) => {
          textEl.setPlaceholder("My New Note");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].type = `note(${value}) ${actionType.includes("text") ? "text" : "template"}`;
          });
        });
      // Split toggle
      new Setting(container)
        .setName("Split")
        .setDesc("Should the new note open in a split pane?")
        .addToggle((toggleEl) => {
          const currentType = this.outputObject.actions[actionIndex].type;
          const noteName = currentType.match(/note\(([^)]*)\)/)?.[1] || "My New Note";
          if (toggleEl.getValue()) {
            this.outputObject.actions[actionIndex].type = `note(${noteName}, split) ${actionType.includes("text") ? "text" : "template"}`;
          } else {
            this.outputObject.actions[actionIndex].type = `note(${noteName}) ${actionType.includes("text") ? "text" : "template"}`;
          }
        });
      // Content input
      new Setting(container)
        .setName("Content")
        .setDesc(actionType.includes("text") ? "Text to insert" : "Template to insert")
        .addText((textEl) => {
          textEl.setPlaceholder(actionType.includes("text") ? "My Text to Insert" : "My Template");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    } else if (actionType === "command") {
      // Command input with dropdown and suggestions (same as regular command button)
      const commandSuggestEl = createEl("input", { type: "text" });
      new CommandSuggest(this.app, commandSuggestEl);
      commandSuggestEl.placeholder = "Toggle Pin";
      commandSuggestEl.addEventListener("change", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (<HTMLInputElement>e.target).value;
      });
      commandSuggestEl.addEventListener("blur", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (<HTMLInputElement>e.target).value;
      });
      new Setting(container)
        .setName("Command")
        .setDesc("Enter a command to run")
        .addDropdown((drop) => {
          drop.addOption("command", "Default");
          drop.addOption("prepend command", "Prepend");
          drop.addOption("append command", "Append");
          drop.onChange((value) => {
            this.outputObject.actions[actionIndex].type = value;
          });
        })
        .addText((textEl) => {
          textEl.inputEl.replaceWith(commandSuggestEl);
        });
    } else if (actionType.includes("template")) {
      // Template input with suggestions (same as regular template button)
      const fileSuggestEl = createEl("input", { type: "text" });
      new TemplateSuggest(this.app, fileSuggestEl);
      fileSuggestEl.placeholder = "My Template";
      fileSuggestEl.addEventListener("change", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (<HTMLInputElement>e.target).value;
      });
      fileSuggestEl.addEventListener("blur", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (<HTMLInputElement>e.target).value;
      });
      new Setting(container)
        .setName("Template")
        .setDesc("Select a template")
        .addText((textEl) => {
          textEl.inputEl.replaceWith(fileSuggestEl);
        });
    } else if (actionType === "link") {
      // Link input
      new Setting(container)
        .setName("Link")
        .setDesc("Enter a link to open")
        .addText((textEl) => {
          textEl.setPlaceholder("https://obsidian.md");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    } else if (actionType === "calculate") {
      // Calculate input
      new Setting(container)
        .setName("Calculate")
        .setDesc("Enter a calculation, you can reference a line number with $LineNumber")
        .addText((textEl) => {
          textEl.setPlaceholder("2+$10");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    } else if (actionType === "copy") {
      // Copy input
      new Setting(container)
        .setName("Text")
        .setDesc("Text to copy for clipboard")
        .addText((textEl) => {
          textEl.setPlaceholder("Text to copy");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    } else {
      // Default text input for append/prepend text
      new Setting(container)
        .setName("Text")
        .setDesc("Text to insert")
        .addText((textEl) => {
          textEl.setPlaceholder("My Text to Insert");
          textEl.onChange((value) => {
            this.outputObject.actions[actionIndex].action = value;
          });
        });
    }
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
