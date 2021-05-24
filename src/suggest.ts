// Stole All this from Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { App, ISuggestOwner, Scope, TFile, TAbstractFile } from "obsidian";
import { createPopper, Instance as PopperInstance } from "@popperjs/core";
import { ExtendedBlockCache } from "./types";
import { getStore } from "./buttonStore";

import { wrapAround } from "./utils";

class Suggest<T> {
  private owner: ISuggestOwner<T>;
  private values: T[];
  private suggestions: HTMLDivElement[];
  private selectedItem: number;
  private containerEl: HTMLElement;

  constructor(owner: ISuggestOwner<T>, containerEl: HTMLElement, scope: Scope) {
    this.owner = owner;
    this.containerEl = containerEl;

    containerEl.on(
      "click",
      ".suggestion-item",
      this.onSuggestionClick.bind(this)
    );
    containerEl.on(
      "mousemove",
      ".suggestion-item",
      this.onSuggestionMouseover.bind(this)
    );

    scope.register([], "ArrowUp", (event) => {
      if (!event.isComposing) {
        this.setSelectedItem(this.selectedItem - 1, true);
        return false;
      }
    });

    scope.register([], "ArrowDown", (event) => {
      if (!event.isComposing) {
        this.setSelectedItem(this.selectedItem + 1, true);
        return false;
      }
    });

    scope.register([], "Enter", (event) => {
      if (!event.isComposing) {
        this.useSelectedItem(event);
        return false;
      }
    });
  }

  onSuggestionClick(event: MouseEvent, el: HTMLDivElement): void {
    event.preventDefault();

    const item = this.suggestions.indexOf(el);
    this.setSelectedItem(item, false);
    this.useSelectedItem(event);
  }

  onSuggestionMouseover(_event: MouseEvent, el: HTMLDivElement): void {
    const item = this.suggestions.indexOf(el);
    this.setSelectedItem(item, false);
  }

  setSuggestions(values: T[]) {
    this.containerEl.empty();
    const suggestionEls: HTMLDivElement[] = [];

    values.forEach((value) => {
      const suggestionEl = this.containerEl.createDiv("suggestion-item");
      this.owner.renderSuggestion(value, suggestionEl);
      suggestionEls.push(suggestionEl);
    });

    this.values = values;
    this.suggestions = suggestionEls;
    this.setSelectedItem(0, false);
  }

  useSelectedItem(event: MouseEvent | KeyboardEvent) {
    const currentValue = this.values[this.selectedItem];
    if (currentValue) {
      this.owner.selectSuggestion(currentValue, event);
    }
  }

  setSelectedItem(selectedIndex: number, scrollIntoView: boolean) {
    const normalizedIndex = wrapAround(selectedIndex, this.suggestions.length);
    const prevSelectedSuggestion = this.suggestions[this.selectedItem];
    const selectedSuggestion = this.suggestions[normalizedIndex];

    prevSelectedSuggestion?.removeClass("is-selected");
    selectedSuggestion?.addClass("is-selected");

    this.selectedItem = normalizedIndex;

    if (scrollIntoView) {
      selectedSuggestion.scrollIntoView(false);
    }
  }
}

export abstract class TextInputSuggest<T> implements ISuggestOwner<T> {
  protected app: App;
  protected inputEl: HTMLInputElement;

  private popper: PopperInstance;
  private scope: Scope;
  private suggestEl: HTMLElement;
  private suggest: Suggest<T>;

  constructor(app: App, inputEl: HTMLInputElement) {
    this.app = app;
    this.inputEl = inputEl;
    this.scope = new Scope();

    this.suggestEl = createDiv("suggestion-container");
    const suggestion = this.suggestEl.createDiv("suggestion");
    this.suggest = new Suggest(this, suggestion, this.scope);

    this.scope.register([], "Escape", this.close.bind(this));

    this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
    this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
    this.inputEl.addEventListener("blur", this.close.bind(this));
    this.suggestEl.on(
      "mousedown",
      ".suggestion-container",
      (event: MouseEvent) => {
        event.preventDefault();
      }
    );
  }

  onInputChanged(): void {
    const inputStr = this.inputEl.value;
    const suggestions = this.getSuggestions(inputStr);

    if (suggestions.length > 0) {
      this.suggest.setSuggestions(suggestions);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.open((<any>this.app).dom.appContainerEl, this.inputEl);
    }
  }

  open(container: HTMLElement, inputEl: HTMLElement): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>this.app).keymap.pushScope(this.scope);

    container.appendChild(this.suggestEl);
    this.popper = createPopper(inputEl, this.suggestEl, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "sameWidth",
          enabled: true,
          fn: ({ state, instance }) => {
            // Note: positioning needs to be calculated twice -
            // first pass - positioning it according to the width of the popper
            // second pass - position it with the width bound to the reference element
            // we need to early exit to avoid an infinite loop
            const targetWidth = `${state.rects.reference.width}px`;
            if (state.styles.popper.width === targetWidth) {
              return;
            }
            state.styles.popper.width = targetWidth;
            instance.update();
          },
          phase: "beforeWrite",
          requires: ["computeStyles"],
        },
      ],
    });
  }

  close(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>this.app).keymap.popScope(this.scope);

    this.suggest.setSuggestions([]);
    this.popper && this.popper.destroy();
    this.suggestEl.detach();
  }

  abstract getSuggestions(inputStr: string): T[];
  abstract renderSuggestion(item: T, el: HTMLElement): void;
  abstract selectSuggestion(item: T): void;
}

interface Command {
  id: string;
  name: string;
}

export class CommandSuggest extends TextInputSuggest<Command> {
  getSuggestions(inputStr: string): Command[] {
    const commands = this.app.commands.commands;
    const commandNames: Command[] = [];
    const inputLowerCase = inputStr.toLowerCase();

    for (const command in commands) {
      const commandObj = commands[command];
      if (commandObj.name.toLowerCase().contains(inputLowerCase)) {
        commandNames.push(commandObj);
      }
    }
    return commandNames;
  }

  renderSuggestion(command: Command, el: HTMLElement): void {
    el.setText(command.name);
  }

  selectSuggestion(command: Command): void {
    this.inputEl.value = command.name;
    this.inputEl.trigger("input");
    this.close();
  }
}

export class TemplateSuggest extends TextInputSuggest<TFile> {
  private templatesEnabled = this.app.internalPlugins.plugins.templates.enabled;
  private templaterPlugin = this.app.plugins.plugins["templater-obsidian"];
  // only run if templates plugin is enabled
  private folder = (): string[] => {
    const folders = [];
    if (this.templatesEnabled) {
      const folder = this.app.internalPlugins.plugins.templates.instance.options
        .folder;
      if (folder) {
        folders.push(folder.toLowerCase());
      }
      if (this.templaterPlugin) {
        const folder = this.templaterPlugin.settings.template_folder;
        if (folder) {
          folders.push(folder.toLowerCase());
        }
      }
    }
    return folders[0] ? folders : undefined;
  };

  getSuggestions(inputStr: string): TFile[] {
    const abstractFiles = this.app.vault.getAllLoadedFiles();
    const files: TFile[] = [];
    const lowerCaseInputStr = inputStr.toLowerCase();
    const folders = this.folder();

    abstractFiles.forEach((file: TAbstractFile) => {
      let exists = false;
      folders &&
        folders.forEach((folder) => {
          if (file.path.toLowerCase().contains(`${folder}/`)) {
            exists = true;
          }
        });
      if (
        file instanceof TFile &&
        file.extension === "md" &&
        exists &&
        file.path.toLowerCase().contains(lowerCaseInputStr)
      ) {
        files.push(file);
      }
    });

    return files;
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.setText(file.name.split(".")[0]);
  }

  selectSuggestion(file: TFile): void {
    this.inputEl.value = file.name.split(".")[0];
    this.inputEl.trigger("input");
    this.close();
  }
}

export class ButtonSuggest extends TextInputSuggest<string> {
  getSuggestions(): string[] {
    const buttonStore = getStore(this.app.isMobile);
    const buttons: string[] = [];

    buttonStore.forEach((button: ExtendedBlockCache) => {
      const trimmed = button.id.split("-")[1];
      buttons.push(trimmed);
    });

    return buttons;
  }

  renderSuggestion(button: string, el: HTMLElement): void {
    el.setText(button);
  }

  selectSuggestion(button: string): void {
    this.inputEl.value = this.inputEl.value + button;
    this.inputEl.trigger("input");
    this.close();
  }
}
