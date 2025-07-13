import '@testing-library/jest-dom';

// Mock the global app object and Obsidian API
declare global {
  var app: any;
  var Notice: any;
}

(global as any).app = {
  vault: {
    read: jest.fn(),
    cachedRead: jest.fn(),
    modify: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    getFiles: jest.fn(),
    getMarkdownFiles: jest.fn(),
    getAbstractFileByPath: jest.fn(),
    createFolder: jest.fn(),
  },
  workspace: {
    getActiveViewOfType: jest.fn(),
    getActiveFile: jest.fn(),
    getLeaf: jest.fn(),
    splitActiveLeaf: jest.fn(),
    on: jest.fn(),
    offref: jest.fn(),
    onLayoutReady: jest.fn(),
  },
  metadataCache: {
    getFileCache: jest.fn(),
    on: jest.fn(),
    offref: jest.fn(),
  },
  plugins: {
    plugins: {
      'templater-obsidian': {
        _loaded: true,
        settings: {
          template_folder: 'templates',
          templates_folder: 'templates',
        },
        templater: {
          functions_generator: {
            internal_functions: {
              generate_object: jest.fn(),
            },
            user_functions: {
              user_script_functions: {
                generate_user_script_functions: jest.fn(),
              },
              user_system_functions: {
                generate_system_functions: jest.fn(),
              },
            },
          },
          parser: {
            parse_commands: jest.fn(),
          },
        },
      },
      buttons: {
        manifest: {
          version: '1.0.0',
        },
      },
    },
  },
  internalPlugins: {
    plugins: {
      templates: {
        enabled: true,
        instance: {
          options: {
            folder: 'templates',
          },
          insertTemplate: jest.fn(),
        },
      },
    },
  },
  commands: {
    executeCommandById: jest.fn(),
    listCommands: jest.fn(),
    commands: {},
  },
  isMobile: false,
} as any;

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock window.open
global.window.open = jest.fn();

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});

// Mock CodeMirror
(global as any).CodeMirror = {
  addLineWidget: jest.fn(),
  clear: jest.fn(),
};

// Mock Obsidian classes
export class MockTFile {
  path: string;
  basename: string;
  extension: string;
  name: string;
  unsafeCachedData: string;

  constructor(path: string, basename: string = 'test', extension: string = 'md') {
    this.path = path;
    this.basename = basename;
    this.extension = extension;
    this.name = `${basename}.${extension}`;
    this.unsafeCachedData = '';
  }
}

export class MockMarkdownView {
  file: MockTFile;
  editor: any;

  constructor(file: MockTFile) {
    this.file = file;
    this.editor = {
      setCursor: jest.fn(),
      replaceSelection: jest.fn(),
      getValue: jest.fn(),
      setValue: jest.fn(),
    };
  }

  save() {
    return Promise.resolve();
  }
}

export class MockModal {
  app: any;
  titleEl: HTMLElement;
  contentEl: HTMLElement;

  constructor(app: any) {
    this.app = app;
    this.titleEl = document.createElement('div');
    this.contentEl = document.createElement('div');
  }

  open() {
    return this;
  }

  close() {
    return this;
  }
}

export class MockNotice {
  message: string;
  timeout: number;

  constructor(message: string, timeout: number = 5000) {
    this.message = message;
    this.timeout = timeout;
  }
}

export class MockEvents {
  private events: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
    return { event, callback };
  }

  off(event: string, callback: Function) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  offref(ref: any) {
    if (ref && ref.event && ref.callback) {
      this.off(ref.event, ref.callback);
    }
  }

  trigger(event: string, ...args: any[]) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach(callback => callback(...args));
    }
  }
}

// Mock HTML elements
(HTMLElement.prototype as any).createEl = function(tag: string, attrs?: any): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    if (attrs.cls) {
      el.className = Array.isArray(attrs.cls) ? attrs.cls.join(' ') : attrs.cls;
    }
    if (attrs.text) {
      el.textContent = attrs.text;
    }
  }
  return el;
};

(HTMLElement.prototype as any).on = function(event: string, selector: string, callback: Function) {
  this.addEventListener(event, callback);
};

// Mock math-expression-evaluator
jest.mock('math-expression-evaluator', () => ({
  eval: jest.fn((expr: string) => {
    // Simple mock evaluation
    if (expr === '2+2') return 4;
    if (expr === '10*5') return 50;
    return 42; // Default mock result
  }),
}));

// Mock Popper.js
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
  })),
}));

// Global test utilities
export const createMockApp = () => (global as any).app;
export const createMockFile = (path: string = 'test.md') => new MockTFile(path);
export const createMockView = (file?: MockTFile) => new MockMarkdownView(file || createMockFile());