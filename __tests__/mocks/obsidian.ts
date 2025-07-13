// Mock implementation of the Obsidian API for testing

export class TFile {
  path: string;
  basename: string;
  extension: string;
  name: string;
  parent: any;
  vault: any;
  stat: any;
  unsafeCachedData: string;

  constructor(path: string) {
    this.path = path;
    this.basename = path.split('/').pop()?.split('.')[0] || 'untitled';
    this.extension = path.split('.').pop() || 'md';
    this.name = path.split('/').pop() || 'untitled.md';
    this.parent = null;
    this.vault = null;
    this.stat = { ctime: Date.now(), mtime: Date.now(), size: 0 };
    this.unsafeCachedData = '';
  }
}

export class TFolder {
  path: string;
  name: string;
  parent: any;
  vault: any;
  children: any[];

  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || 'untitled';
    this.parent = null;
    this.vault = null;
    this.children = [];
  }
}

export class TAbstractFile {
  path: string;
  name: string;
  parent: any;
  vault: any;
  unsafeCachedData: string;

  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || 'untitled';
    this.parent = null;
    this.vault = null;
    this.unsafeCachedData = '';
  }
}

export class Component {
  load(): void {}
  unload(): void {}
  onload(): void {}
  onunload(): void {}
  register(fn: () => void): void {}
  registerEvent(eventRef: any): void {}
  registerDomEvent(el: Element, event: string, fn: () => void): void {}
  registerInterval(id: number): void {}
}

export class MarkdownRenderChild extends Component {
  containerEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    super();
    this.containerEl = containerEl;
  }
}

export class Plugin extends Component {
  app: App;
  manifest: any;

  constructor(app: App, manifest: any) {
    super();
    this.app = app;
    this.manifest = manifest;
  }

  addCommand(command: any): void {}
  addRibbonIcon(icon: string, title: string, callback: () => void): void {}
  addStatusBarItem(): any {
    return { setText: jest.fn() };
  }
  addSettingTab(settingTab: any): void {}
  registerMarkdownPostProcessor(processor: any): void {}
  registerMarkdownCodeBlockProcessor(language: string, processor: any): void {}
  registerEditorExtension(extension: any): void {}
  registerView(type: string, viewCreator: any): void {}
  registerHoverLinkSource(id: string, source: any): void {}
  registerEditorSuggest(suggest: any): void {}
  registerCodeMirror(fn: any): void {}
  loadData(): Promise<any> {
    return Promise.resolve(null);
  }
  saveData(data: any): Promise<void> {
    return Promise.resolve();
  }
}

export class Modal extends Component {
  app: App;
  titleEl: HTMLElement;
  contentEl: HTMLElement;
  modalEl: HTMLElement;
  scope: any;

  constructor(app: App) {
    super();
    this.app = app;
    this.titleEl = document.createElement('div');
    this.contentEl = document.createElement('div');
    this.modalEl = document.createElement('div');
    this.scope = {
      register: jest.fn(),
      unregister: jest.fn(),
    };
  }

  open(): void {}
  close(): void {}
  onOpen(): void {}
  onClose(): void {}
}

export class Setting {
  settingEl: HTMLElement;
  infoEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.settingEl = document.createElement('div');
    this.infoEl = document.createElement('div');
    this.nameEl = document.createElement('div');
    this.descEl = document.createElement('div');
    this.controlEl = document.createElement('div');
  }

  setName(name: string): this {
    this.nameEl.textContent = name;
    return this;
  }

  setDesc(desc: string): this {
    this.descEl.textContent = desc;
    return this;
  }

  addText(fn: (text: any) => void): this {
    const textEl = {
      inputEl: document.createElement('input'),
      setPlaceholder: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      getValue: jest.fn().mockReturnValue(''),
      onChange: jest.fn().mockReturnThis(),
      onChanged: jest.fn().mockReturnThis(),
    };
    fn(textEl);
    return this;
  }

  addToggle(fn: (toggle: any) => void): this {
    const toggleEl = {
      setValue: jest.fn().mockReturnThis(),
      getValue: jest.fn().mockReturnValue(false),
      onChange: jest.fn().mockReturnThis(),
      onClick: jest.fn().mockReturnThis(),
    };
    fn(toggleEl);
    return this;
  }

  addDropdown(fn: (dropdown: any) => void): this {
    const dropdownEl = {
      addOption: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      getValue: jest.fn().mockReturnValue(''),
      onChange: jest.fn().mockReturnThis(),
    };
    fn(dropdownEl);
    return this;
  }

  addButton(fn: (button: any) => void): this {
    const buttonEl = {
      setButtonText: jest.fn().mockReturnThis(),
      setCta: jest.fn().mockReturnThis(),
      setWarning: jest.fn().mockReturnThis(),
      onClick: jest.fn().mockReturnThis(),
    };
    fn(buttonEl);
    return this;
  }

  setClass(className: string): this {
    return this;
  }

  setTooltip(tooltip: string): this {
    return this;
  }

  setDisabled(disabled: boolean): this {
    return this;
  }

  then(fn: (setting: this) => void): this {
    fn(this);
    return this;
  }

  empty(): this {
    return this;
  }
}

export class MarkdownView {
  file: TFile;
  editor: any;
  data: string;
  app: App;
  leaf: any;
  contentEl: HTMLElement;
  currentMode: any;
  modes: any;
  previewMode: any;
  sourceMode: any;

  constructor() {
    this.file = new TFile('test.md');
    this.editor = {
      getValue: jest.fn(),
      setValue: jest.fn(),
      setCursor: jest.fn(),
      getCursor: jest.fn(),
      replaceSelection: jest.fn(),
      getSelection: jest.fn(),
      getRange: jest.fn(),
      replaceRange: jest.fn(),
      getDoc: jest.fn(),
      refresh: jest.fn(),
    };
    this.data = '';
    this.app = null as any;
    this.leaf = null;
    this.contentEl = document.createElement('div');
    this.currentMode = null;
    this.modes = {};
    this.previewMode = null;
    this.sourceMode = null;
  }

  getViewType(): string {
    return 'markdown';
  }

  getDisplayText(): string {
    return this.file.basename;
  }

  save(): Promise<void> {
    return Promise.resolve();
  }

  load(): Promise<void> {
    return Promise.resolve();
  }

  clear(): void {}

  onload(): void {}
  onunload(): void {}
}

export class Notice {
  message: string;
  timeout: number;

  constructor(message: string, timeout: number = 5000) {
    this.message = message;
    this.timeout = timeout;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  hide(): void {}
}

export class Events {
  private events: Map<string, Function[]> = new Map();

  on(name: string, callback: Function): any {
    if (!this.events.has(name)) {
      this.events.set(name, []);
    }
    this.events.get(name)!.push(callback);
    return { name, callback };
  }

  off(name: string, callback: Function): void {
    if (this.events.has(name)) {
      const callbacks = this.events.get(name)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  offref(ref: any): void {
    if (ref && ref.name && ref.callback) {
      this.off(ref.name, ref.callback);
    }
  }

  trigger(name: string, ...args: any[]): void {
    if (this.events.has(name)) {
      this.events.get(name)!.forEach(callback => callback(...args));
    }
  }
}

export class App {
  vault: any;
  workspace: any;
  metadataCache: any;
  fileManager: any;
  plugins: any;
  internalPlugins: any;
  commands: any;
  keymap: any;
  scope: any;
  lastKnownMenuPosition: any;
  isMobile: boolean;

  constructor() {
    this.vault = {
      adapter: null,
      configDir: '.obsidian',
      getAbstractFileByPath: jest.fn(),
      getFileByPath: jest.fn(),
      getFiles: jest.fn().mockReturnValue([]),
      getMarkdownFiles: jest.fn().mockReturnValue([]),
      getFolderByPath: jest.fn(),
      create: jest.fn(),
      createFolder: jest.fn(),
      read: jest.fn(),
      cachedRead: jest.fn(),
      modify: jest.fn(),
      delete: jest.fn(),
      rename: jest.fn(),
      copy: jest.fn(),
      exists: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      offref: jest.fn(),
      trigger: jest.fn(),
    };

    this.workspace = {
      activeLeaf: null,
      leftSplit: null,
      rightSplit: null,
      rootSplit: null,
      layoutReady: true,
      requestSaveLayout: jest.fn(),
      getActiveFile: jest.fn(),
      getActiveViewOfType: jest.fn(),
      getLeaf: jest.fn().mockReturnValue({
        openFile: jest.fn(),
        setViewState: jest.fn(),
      }),
      splitActiveLeaf: jest.fn().mockReturnValue({
        openFile: jest.fn(),
      }),
      getLeavesOfType: jest.fn(),
      iterateRootLeaves: jest.fn(),
      iterateAllLeaves: jest.fn(),
      getLayout: jest.fn(),
      setLayout: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      offref: jest.fn(),
      trigger: jest.fn(),
      onLayoutReady: jest.fn(),
    };

    this.metadataCache = {
      getFileCache: jest.fn(),
      getCache: jest.fn(),
      fileToLinktext: jest.fn(),
      resolvedLinks: {},
      unresolvedLinks: {},
      on: jest.fn(),
      off: jest.fn(),
      offref: jest.fn(),
      trigger: jest.fn(),
    };

    this.fileManager = {
      generateMarkdownLink: jest.fn(),
      getAllLinkResolutions: jest.fn(),
      getNewFileParent: jest.fn(),
    };

    this.plugins = {
      plugins: {},
      manifests: {},
      enabledPlugins: new Set(),
      enablePlugin: jest.fn(),
      disablePlugin: jest.fn(),
      isEnabled: jest.fn(),
      getPlugin: jest.fn(),
    };

    this.internalPlugins = {
      plugins: {
        templates: {
          enabled: false,
          instance: {
            options: {
              folder: 'templates',
            },
            insertTemplate: jest.fn(),
          },
        },
      },
    };

    this.commands = {
      executeCommandById: jest.fn(),
      listCommands: jest.fn().mockReturnValue([]),
      findCommand: jest.fn(),
      removeCommand: jest.fn(),
      addCommand: jest.fn(),
      commands: {},
    };

    this.keymap = {
      pushScope: jest.fn(),
      popScope: jest.fn(),
    };

    this.scope = {
      register: jest.fn(),
      unregister: jest.fn(),
    };

    this.lastKnownMenuPosition = { x: 0, y: 0 };
    this.isMobile = false;
  }
}

export interface EventRef {
  e: Events;
  fn: Function;
}

export interface BlockCache {
  id: string;
  type: string;
  position: {
    start: {
      line: number;
      ch: number;
      offset: number;
    };
    end: {
      line: number;
      ch: number;
      offset: number;
    };
  };
}

export interface CachedMetadata {
  blocks?: Record<string, BlockCache>;
  headings?: any[];
  links?: any[];
  embeds?: any[];
  tags?: any[];
  sections?: any[];
  listItems?: any[];
  frontmatter?: any;
  frontmatterPosition?: any;
  frontmatterLinks?: any[];
}

export interface Pos {
  line: number;
  ch: number;
}

export interface Editor {
  getValue(): string;
  setValue(value: string): void;
  setCursor(line: number, ch?: number): void;
  getCursor(): Pos;
  replaceSelection(text: string): void;
  getSelection(): string;
  getRange(from: Pos, to: Pos): string;
  replaceRange(text: string, from: Pos, to?: Pos): void;
  getDoc(): any;
  refresh(): void;
}

export interface ISuggestOwner<T> {
  selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
  renderSuggestion(value: T, el: HTMLElement): void;
  onChooseSuggestion(item: T, evt: MouseEvent | KeyboardEvent): void;
}

export interface Scope {
  register(modifiers: string[], key: string, func: () => void): void;
  unregister(func: () => void): void;
}

// Helper functions to create elements
export function createEl(tag: string, o?: any): HTMLElement {
  const el = document.createElement(tag);
  if (o) {
    if (o.cls) {
      el.className = Array.isArray(o.cls) ? o.cls.join(' ') : o.cls;
    }
    if (o.text) {
      el.textContent = o.text;
    }
    if (o.attr) {
      Object.keys(o.attr).forEach(key => {
        el.setAttribute(key, o.attr[key]);
      });
    }
  }
  return el;
}

export function createDiv(o?: any): HTMLDivElement {
  return createEl('div', o) as HTMLDivElement;
}

export function createSpan(o?: any): HTMLSpanElement {
  return createEl('span', o) as HTMLSpanElement;
}

export function createFragment(): DocumentFragment {
  return document.createDocumentFragment();
}

// Default export
export default {
  TFile,
  TFolder,
  TAbstractFile,
  Component,
  MarkdownRenderChild,
  Plugin,
  Modal,
  Setting,
  MarkdownView,
  Notice,
  Events,
  App,
  createEl,
  createDiv,
  createSpan,
  createFragment,
};