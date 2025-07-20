import { Modal, App, MarkdownView, Editor } from "obsidian";
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
  
  // Handler properties for event listeners
  private handleCommandChange: (e: Event) => void;
  private handleCommandBlur: (e: Event) => void;
  private handleFileChange: (e: Event) => void;
  private handleFileBlur: (e: Event) => void;

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
    titleEl.addClass("button-maker-title");
    contentEl.addClass("button-maker");
    
    // Create main container with modern styling
    const mainContainer = contentEl.createEl("div", { cls: "button-maker-container" });
    
    // Create form with improved layout
    mainContainer.createEl("form", { cls: "button-maker-form" }, (formEl) => {
      
      // Basic Settings Section
      const basicSection = formEl.createEl("div", { cls: "form-section" });
      basicSection.createEl("h3", { cls: "section-title", text: "Basic Settings" });
      
      // Button Name with improved styling
      const nameContainer = basicSection.createEl("div", { cls: "form-field" });
      nameContainer.createEl("label", { cls: "field-label", text: "Button Name" });
      nameContainer.createEl("div", { cls: "field-description", text: "What would you like to call this button?" });
      const nameInput = nameContainer.createEl("input", { 
        type: "text", 
        cls: "field-input",
        attr: { placeholder: "My Awesome Button" }
      });
      nameInput.addEventListener("input", (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.buttonPreviewEl.setText(value);
        this.outputObject.name = value;
      });
      window.setTimeout(() => nameInput.focus(), 10);

      // Button Type with improved dropdown
      const typeContainer = basicSection.createEl("div", { cls: "form-field" });
      typeContainer.createEl("label", { cls: "field-label", text: "Button Type" });
      typeContainer.createEl("div", { cls: "field-description", text: "What type of button are you making?" });
      const typeSelect = typeContainer.createEl("select", { cls: "dropdown" });
      
      // Add type options with better descriptions
      const typeOptions = [
        { value: "pre", text: "Select a Button Type" },
        { value: "command", text: "Command - Run a command prompt command" },
        { value: "link", text: "Link - Open a URL or URI" },
        { value: "template", text: "Template - Insert or create notes from templates" },
        { value: "text", text: "Text - Insert or create notes with text" },
        { value: "calculate", text: "Calculate - Run a mathematical calculation" },
        { value: "swap", text: "Swap - Create a multi-purpose Inline Button from other Buttons" },
        { value: "copy", text: "Copy - Copy text to clipboard" },
        { value: "chain", text: "Chain - Run multiple actions in sequence" }
      ];
      
      typeOptions.forEach((option, index) => {
        const optionEl = typeSelect.createEl("option");
        optionEl.value = option.value;
        optionEl.textContent = option.text;
        // Set the placeholder option as selected by default
        if (index === 0) {
          optionEl.selected = true;
          this.outputObject.type = option.value;
        }
      });

      // Action container for dynamic content
      const actionContainer = formEl.createEl("div", { cls: "action-container" });
      
      typeSelect.addEventListener("change", (e) => {
        const value = (e.target as HTMLSelectElement).value;
        this.outputObject.type = value;
        actionContainer.empty();
        
        // Only render action fields if a specific type is selected (not the placeholder)
        if (value === "pre") {
          // Don't render anything for the placeholder
          return;
        } else if (value === "chain") {
          this.renderChainActions(actionContainer);
        } else if (value === "link") {
          this.renderLinkAction(actionContainer);
        } else if (value === "command") {
          this.renderCommandAction(actionContainer);
        } else if (value.includes("template")) {
          this.renderTemplateAction(actionContainer);
        } else if (value === "text") {
          this.renderTextAction(actionContainer);
        } else if (value === "calculate") {
          this.renderCalculateAction(actionContainer);
        } else if (value === "swap") {
          this.renderSwapAction(actionContainer);
        } else if (value === "copy") {
          this.renderCopyAction(actionContainer);
        }
      });

      // Advanced Settings Section
      const advancedSection = formEl.createEl("div", { cls: "form-section" });
      advancedSection.createEl("h3", { cls: "section-title", text: "Advanced Settings" });
      
      // Button Block ID
      const blockIdContainer = advancedSection.createEl("div", { cls: "form-field" });
      blockIdContainer.createEl("label", { cls: "field-label", text: "Button Block ID" });
      blockIdContainer.createEl("div", { cls: "field-description", text: "Provide a custom button-block-id" });
      const blockIdInput = blockIdContainer.createEl("input", { 
        type: "text", 
        cls: "field-input",
        attr: { placeholder: "buttonId" }
      });
      blockIdInput.addEventListener("input", (e) => {
        this.outputObject.blockId = (e.target as HTMLInputElement).value;
      });

      // Toggle Settings
      const toggleSettings = advancedSection.createEl("div", { cls: "toggle-settings" });
      
      // Remove Toggle
      const removeContainer = toggleSettings.createEl("div", { cls: "toggle-field" });
      const removeToggleRow = removeContainer.createEl("div", { cls: "toggle-row" });
      removeToggleRow.createEl("label", { cls: "toggle-label" });
      const removeToggle = removeToggleRow.createEl("input", { type: "checkbox", cls: "toggle-input" });
      removeToggleRow.createEl("span", { cls: "toggle-text", text: "Remove after click" });
      removeToggleRow.createEl("div", { cls: "toggle-description", text: "Remove this button (or other buttons) after clicking?" });
      
      removeToggle.addEventListener("change", (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
          this.renderRemoveSettings(removeContainer);
          this.outputObject.remove = "true";
        } else {
          this.outputObject.remove = "";
          const removeSettings = removeContainer.querySelector(".remove-settings");
          if (removeSettings) removeSettings.remove();
        }
      });

      // Replace Toggle
      const replaceContainer = toggleSettings.createEl("div", { cls: "toggle-field" });
      const replaceToggleRow = replaceContainer.createEl("div", { cls: "toggle-row" });
      replaceToggleRow.createEl("label", { cls: "toggle-label" });
      const replaceToggle = replaceToggleRow.createEl("input", { type: "checkbox", cls: "toggle-input" });
      replaceToggleRow.createEl("span", { cls: "toggle-text", text: "Replace content" });
      replaceToggleRow.createEl("div", { cls: "toggle-description", text: "Replace lines in the note after clicking?" });
      
      replaceToggle.addEventListener("change", (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
          this.renderReplaceSettings(replaceContainer);
        } else {
          const replaceSettings = replaceContainer.querySelector(".replace-settings");
          if (replaceSettings) replaceSettings.remove();
        }
      });

      // Inherit Toggle
      const inheritContainer = toggleSettings.createEl("div", { cls: "toggle-field" });
      const inheritToggleRow = inheritContainer.createEl("div", { cls: "toggle-row" });
      inheritToggleRow.createEl("label", { cls: "toggle-label" });
      const inheritToggle = inheritToggleRow.createEl("input", { type: "checkbox", cls: "toggle-input" });
      inheritToggleRow.createEl("span", { cls: "toggle-text", text: "Inherit from other button" });
      inheritToggleRow.createEl("div", { cls: "toggle-description", text: "Inherit args by adding an existing button block-id?" });
      
      inheritToggle.addEventListener("change", (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
          this.renderInheritSettings(inheritContainer);
        } else {
          this.outputObject.id = "";
          const inheritSettings = inheritContainer.querySelector(".inherit-settings");
          if (inheritSettings) inheritSettings.remove();
        }
      });

      // Templater Toggle
      const templaterContainer = toggleSettings.createEl("div", { cls: "toggle-field" });
      const templaterToggleRow = templaterContainer.createEl("div", { cls: "toggle-row" });
      templaterToggleRow.createEl("label", { cls: "toggle-label" });
      const templaterToggle = templaterToggleRow.createEl("input", { type: "checkbox", cls: "toggle-input" });
      templaterToggleRow.createEl("span", { cls: "toggle-text", text: "Enable Templater" });
      templaterToggleRow.createEl("div", { cls: "toggle-description", text: "Convert templater commands inside your button on each click?" });
      
      templaterToggle.addEventListener("change", (e) => {
        this.outputObject.templater = (e.target as HTMLInputElement).checked;
      });

      // Styling Section
      const stylingSection = formEl.createEl("div", { cls: "form-section" });
      stylingSection.createEl("h3", { cls: "section-title", text: "Styling" });
      
      // Custom Class
      const classContainer = stylingSection.createEl("div", { cls: "form-field" });
      classContainer.createEl("label", { cls: "field-label", text: "Custom Class" });
      classContainer.createEl("div", { cls: "field-description", text: "Add a custom class for button styling" });
      const classInput = classContainer.createEl("input", { 
        type: "text", 
        cls: "field-input"
      });
      classInput.addEventListener("input", (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.buttonPreviewEl.setAttribute("class", value);
        this.outputObject.class = value;
        if (value === "") {
          this.buttonPreviewEl.setAttribute("class", "button-default");
        }
      });

      // Color Selection
      const colorContainer = stylingSection.createEl("div", { cls: "form-field" });
      colorContainer.createEl("label", { cls: "field-label", text: "Color" });
      colorContainer.createEl("div", { cls: "field-description", text: "What color would you like your button to be?" });
      const colorSelect = colorContainer.createEl("select", { cls: "dropdown" });
      
      const colorOptions = [
        { value: "default", text: "Default Color" },
        { value: "blue", text: "Blue" },
        { value: "red", text: "Red" },
        { value: "green", text: "Green" },
        { value: "yellow", text: "Yellow" },
        { value: "purple", text: "Purple" },
        { value: "custom", text: "Custom" }
      ];
      
      colorOptions.forEach(option => {
        const optionEl = colorSelect.createEl("option");
        optionEl.value = option.value;
        optionEl.textContent = option.text;
        // Set default color as selected
        if (option.value === "default") {
          optionEl.selected = true;
        }
      });

      colorSelect.addEventListener("change", (e) => {
        const value = (e.target as HTMLSelectElement).value;
        if (value === "custom") {
          this.renderCustomColorSettings(colorContainer);
        } else {
          this.outputObject.color = value;
          this.updateButtonPreview();
        }
      });

      // Action Buttons
      const buttonContainer = formEl.createEl("div", { cls: "form-actions" });
      const cancelBtn = buttonContainer.createEl("button", { 
        type: "button", 
        cls: "btn btn-secondary",
        text: "Cancel"
      });
      cancelBtn.addEventListener("click", () => this.close());
      
      buttonContainer.createEl("button", { 
        type: "submit", 
        cls: "btn btn-primary",
        text: "Insert Button"
      });

      formEl.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        insertButton(this.app, this.outputObject);
        this.close();
      });
    });

    // Button Preview Section
    const previewSection = mainContainer.createEl("div", { cls: "preview-section" });
    previewSection.createEl("h3", { cls: "section-title", text: "Button Preview" });
    const previewContainer = previewSection.createEl("div", { cls: "preview-container" });
    this.buttonPreviewEl = createButton({
      app: this.app,
      el: previewContainer,
      args: { name: "My Awesome Button" },
    });
  }

  private renderChainActions(container: HTMLElement): void {
    if (!Array.isArray(this.outputObject.actions)) {
      this.outputObject.actions = [];
    }

    const actionsHeader = container.createEl("div", { cls: "actions-header" });
    actionsHeader.createEl("h4", { text: "Chain Actions" });
    actionsHeader.createEl("p", { text: "Add actions to be executed in sequence" });

    const actionsList = container.createEl("div", { cls: "actions-list" });
    
    const renderActions = () => {
      actionsList.empty();
      
      this.outputObject.actions.forEach((act, idx) => {
        const actionCard = actionsList.createEl("div", { cls: "action-card" });
        
        const actionHeader = actionCard.createEl("div", { cls: "action-header" });
        actionHeader.createEl("span", { cls: "action-number", text: `Action ${idx + 1}` });
        
        const removeBtn = actionHeader.createEl("button", { 
          type: "button", 
          cls: "btn-remove",
          text: "×"
        });
        removeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.outputObject.actions.splice(idx, 1);
          renderActions();
        });

        const typeSelect = actionCard.createEl("select", { cls: "dropdown" });
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
          option.textContent = opt.text;
          if (act.type === opt.value) option.selected = true;
        });

        const actionInputContainer = actionCard.createEl("div", { cls: "action-input-container" });
        this.renderActionInput(actionInputContainer, idx, act.type);

        typeSelect.addEventListener("change", () => {
          this.outputObject.actions[idx].type = typeSelect.value;
          actionInputContainer.empty();
          this.renderActionInput(actionInputContainer, idx, typeSelect.value);
        });
      });
    };

    const addActionBtn = container.createEl("button", { 
      type: "button", 
      cls: "btn btn-add-action",
      text: "+ Add Action"
    });
    addActionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.outputObject.actions.push({ type: "command", action: "" });
      renderActions();
    });

    renderActions();
  }

  private renderLinkAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Link" });
    field.createEl("div", { cls: "field-description", text: "Enter a link to open" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "https://obsidian.md" }
    });
    input.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLInputElement).value;
    });
  }

  private renderCommandAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Command" });
    field.createEl("div", { cls: "field-description", text: "Select a command to run" });
    
    const commandTypeSelect = field.createEl("select", { cls: "dropdown" });
    const defaultOption = commandTypeSelect.createEl("option", { value: "command", text: "Default" });
    defaultOption.selected = true;
    commandTypeSelect.createEl("option", { value: "prepend command", text: "Prepend" });
    commandTypeSelect.createEl("option", { value: "append command", text: "Append" });
    
    const commandInput = field.createEl("input", { 
      type: "text", 
      cls: "field-input"
    });
    commandInput.replaceWith(this.commandSuggestEl);
    
    commandTypeSelect.addEventListener("change", (e) => {
      this.outputObject.type = (e.target as HTMLSelectElement).value;
    });
  }

  private renderTemplateAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Template" });
    field.createEl("div", { cls: "field-description", text: "Select a template note and what should happen" });
    
    const templateTypeSelect = field.createEl("select", { cls: "dropdown" });
    const templateDefaultOption = templateTypeSelect.createEl("option", { value: "template", text: "Do this..." });
    templateDefaultOption.selected = true;
    templateTypeSelect.createEl("option", { value: "prepend template", text: "Prepend" });
    templateTypeSelect.createEl("option", { value: "append template", text: "Append" });
    templateTypeSelect.createEl("option", { value: "line template", text: "Line" });
    templateTypeSelect.createEl("option", { value: "note template", text: "Note" });
    
    const templateInput = field.createEl("input", { 
      type: "text", 
      cls: "field-input"
    });
    templateInput.replaceWith(this.fileSuggestEl);
    
    templateTypeSelect.addEventListener("change", (e) => {
      const value = (e.target as HTMLSelectElement).value;
      // Only update the type if a valid option is selected (not the placeholder)
      if (value && value !== "template") {
        this.outputObject.type = value;
      }
      
      if (value === "line template") {
        this.renderLineNumberField(container);
      } else if (value === "note template") {
        this.renderNoteTemplateFields(container);
      }
    });
  }

  private renderTextAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Text" });
    field.createEl("div", { cls: "field-description", text: "Enter the text content" });
    
    const textTypeSelect = field.createEl("select", { cls: "dropdown" });
    const textDefaultOption = textTypeSelect.createEl("option", { value: "text", text: "Do this..." });
    textDefaultOption.selected = true;
    textTypeSelect.createEl("option", { value: "append text", text: "Append" });
    textTypeSelect.createEl("option", { value: "prepend text", text: "Prepend" });
    textTypeSelect.createEl("option", { value: "line text", text: "Line" });
    textTypeSelect.createEl("option", { value: "note text", text: "Note" });
    
    const textArea = field.createEl("textarea", { 
      cls: "field-textarea",
      attr: { placeholder: "Enter your text content here..." }
    });
    textArea.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLTextAreaElement).value;
    });
    
    textTypeSelect.addEventListener("change", (e) => {
      const value = (e.target as HTMLSelectElement).value;
      // Only update the type if a valid option is selected (not the placeholder)
      if (value && value !== "text") {
        this.outputObject.type = value;
      }
      
      if (value === "line text") {
        this.renderLineNumberField(container);
      } else if (value === "note text") {
        this.renderNoteTextFields(container);
      }
    });
  }

  private renderCalculateAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Calculate" });
    field.createEl("div", { cls: "field-description", text: "Enter a calculation, you can reference a line number with $LineNumber" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "2+$10" }
    });
    input.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLInputElement).value;
    });
  }

  private renderSwapAction(container: HTMLElement): void {
    this.outputObject.type = "";
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Swap" });
    field.createEl("div", { cls: "field-description", text: "Choose buttons to be included in the Inline Swap Button" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input"
    });
    input.replaceWith(this.swapSuggestEl);
  }

  private renderCopyAction(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Text" });
    field.createEl("div", { cls: "field-description", text: "Text to copy for clipboard" });
    const textarea = field.createEl("textarea", { 
      cls: "field-textarea",
      attr: { 
        placeholder: "Text to copy\nSupports multiple lines",
        rows: "5"
      }
    });
    textarea.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLTextAreaElement).value;
    });
  }

  private renderRemoveSettings(container: HTMLElement): void {
    const removeSettings = container.createEl("div", { cls: "remove-settings" });
    const field = removeSettings.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Select Remove" });
    field.createEl("div", { cls: "field-description", text: "Use true to remove this button, or supply an [array] of button block-ids" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input"
    });
    input.replaceWith(this.removeSuggestEl);
  }

  private renderReplaceSettings(container: HTMLElement): void {
    const replaceSettings = container.createEl("div", { cls: "replace-settings" });
    const field = replaceSettings.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Select Lines" });
    field.createEl("div", { cls: "field-description", text: "Supply an array of [startingLine, endingLine] to be replaced" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { value: "[]" }
    });
    input.addEventListener("input", (e) => {
      this.outputObject.replace = (e.target as HTMLInputElement).value;
    });
  }

  private renderInheritSettings(container: HTMLElement): void {
    const inheritSettings = container.createEl("div", { cls: "inherit-settings" });
    const field = inheritSettings.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Button ID" });
    field.createEl("div", { cls: "field-description", text: "Inherit from other buttons by adding their button block-id" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input"
    });
    input.replaceWith(this.idSuggestEl);
  }

  private renderCustomColorSettings(container: HTMLElement): void {
    this.outputObject.color = "";
    
    const customColorContainer = container.createEl("div", { cls: "custom-color-container" });
    
    const bgField = customColorContainer.createEl("div", { cls: "form-field" });
    bgField.createEl("label", { cls: "field-label", text: "Background Color" });
    const bgInput = bgField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "#FFFFFF" }
    });
    bgInput.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.buttonPreviewEl.style.background = value;
      this.outputObject.customColor = value;
    });
    
    const textField = customColorContainer.createEl("div", { cls: "form-field" });
    textField.createEl("label", { cls: "field-label", text: "Text Color" });
    const textInput = textField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "#000000" }
    });
    textInput.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.buttonPreviewEl.style.color = value;
      this.outputObject.customTextColor = value;
    });
  }

  private updateButtonPreview(): void {
    if (this.outputObject.color && this.outputObject.color !== "default") {
      this.buttonPreviewEl.setAttribute("class", `button-default ${this.outputObject.color}`);
      this.buttonPreviewEl.removeAttribute("style");
    } else {
      this.buttonPreviewEl.setAttribute("class", "button-default");
      this.buttonPreviewEl.removeAttribute("style");
    }
  }

  private renderActionInput(container: HTMLElement, actionIndex: number, actionType: string): void {
    if (actionType === "command") {
      // Create a new command suggest element for this action
      const commandInput = createEl("input", { type: "text" });
      new CommandSuggest(this.app, commandInput);
      commandInput.setAttribute("class", "action-input");
      commandInput.setAttribute("placeholder", "Select a command...");
      
      // Set the value from the stored action data
      const currentValue = this.outputObject.actions[actionIndex]?.action || "";
      commandInput.value = currentValue;
      
      container.appendChild(commandInput);
      
      commandInput.addEventListener("change", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
      commandInput.addEventListener("blur", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
    } else if (actionType.includes("template")) {
      // Create a new template suggest element for this action
      const templateInput = createEl("input", { type: "text" });
      new TemplateSuggest(this.app, templateInput);
      templateInput.setAttribute("class", "action-input");
      templateInput.setAttribute("placeholder", "Select a template...");
      
      // Set the value from the stored action data
      const currentValue = this.outputObject.actions[actionIndex]?.action || "";
      templateInput.value = currentValue;
      
      container.appendChild(templateInput);
      
      templateInput.addEventListener("change", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
      templateInput.addEventListener("blur", (e: Event) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
    } else {
      const input = container.createEl("input", { 
        type: "text", 
        cls: "action-input",
        attr: { placeholder: "Enter action..." }
      });
      
      // Set the value from the stored action data
      const currentValue = this.outputObject.actions[actionIndex]?.action || "";
      input.value = currentValue;
      
      input.addEventListener("input", (e) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
      input.addEventListener("blur", (e) => {
        this.outputObject.actions[actionIndex].action = (e.target as HTMLInputElement).value;
      });
    }
  }

  private renderLineNumberField(container: HTMLElement): void {
    const field = container.createEl("div", { cls: "form-field" });
    field.createEl("label", { cls: "field-label", text: "Line Number" });
    field.createEl("div", { cls: "field-description", text: "At which line should the content be inserted?" });
    const input = field.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "69" }
    });
    input.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;
      // Check if we're in template or text mode based on current type
      if (this.outputObject.type.includes("template")) {
        this.outputObject.type = `line(${value}) template`;
      } else if (this.outputObject.type.includes("text")) {
        this.outputObject.type = `line(${value}) text`;
      }
    });
  }

  private renderNoteTemplateFields(container: HTMLElement): void {
    const promptField = container.createEl("div", { cls: "form-field" });
    promptField.createEl("label", { cls: "field-label", text: "Prompt" });
    promptField.createEl("div", { cls: "field-description", text: "Should you be prompted to enter a name for the file on creation?" });
    const promptToggle = promptField.createEl("input", { type: "checkbox", cls: "toggle-input" });
    promptToggle.addEventListener("change", (e) => {
      this.outputObject.prompt = (e.target as HTMLInputElement).checked;
    });

    const nameField = container.createEl("div", { cls: "form-field" });
    nameField.createEl("label", { cls: "field-label", text: "Note Name" });
    nameField.createEl("div", { cls: "field-description", text: "What should the new note be named? Note: if prompt is on, this will be the default name" });
    const nameInput = nameField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "My New Note" }
    });
    nameInput.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLInputElement).value;
    });

    const folderField = container.createEl("div", { cls: "form-field" });
    folderField.createEl("label", { cls: "field-label", text: "Default Folder" });
    folderField.createEl("div", { cls: "field-description", text: "Enter a folder path to place the note in. Defaults to root" });
    const folderInput = folderField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "My Folder" }
    });
    folderInput.addEventListener("input", (e) => {
      this.outputObject.folder = (e.target as HTMLInputElement).value;
    });
  }

  private renderNoteTextFields(container: HTMLElement): void {
    const promptField = container.createEl("div", { cls: "form-field" });
    promptField.createEl("label", { cls: "field-label", text: "Prompt" });
    promptField.createEl("div", { cls: "field-description", text: "Should you be prompted to enter a name for the file on creation?" });
    const promptToggle = promptField.createEl("input", { type: "checkbox", cls: "toggle-input" });
    promptToggle.addEventListener("change", (e) => {
      this.outputObject.prompt = (e.target as HTMLInputElement).checked;
    });

    const nameField = container.createEl("div", { cls: "form-field" });
    nameField.createEl("label", { cls: "field-label", text: "Note Name" });
    nameField.createEl("div", { cls: "field-description", text: "What should the new note be named? Note: if prompt is on, this will be the default name" });
    const nameInput = nameField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "My New Note" }
    });
    nameInput.addEventListener("input", (e) => {
      this.outputObject.action = (e.target as HTMLInputElement).value;
    });

    const folderField = container.createEl("div", { cls: "form-field" });
    folderField.createEl("label", { cls: "field-label", text: "Default Folder" });
    folderField.createEl("div", { cls: "field-description", text: "Enter a folder path to place the note in. Defaults to root" });
    const folderInput = folderField.createEl("input", { 
      type: "text", 
      cls: "field-input",
      attr: { placeholder: "My Folder" }
    });
    folderInput.addEventListener("input", (e) => {
      this.outputObject.folder = (e.target as HTMLInputElement).value;
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
