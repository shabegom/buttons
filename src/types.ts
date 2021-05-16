import { TFile, CachedMetadata } from "obsidian";

declare module "obsidian" {
  interface TAbstractFile {
    unsafeCachedData: string;
  }
  interface App {
    plugins: {
      plugins: {
        "templater-obsidian": { settings: { template_folder: string } };
      };
    };
    isMobile: boolean;
    internalPlugins: {
      plugins: {
        templates: {
          enabled: boolean;
          instance: {
            options: {
              folder: string;
            };
          };
        };
      };
    };
    commands: {
      executeCommandById: (id: string) => unknown;
      listCommands: () => [{ id: string; name: string }];
      commands: Record<string, { name: string; id: string }>;
    };
  }
}

export interface Arguments {
  name?: string;
  type?: string;
  action?: string;
  style?: string;
  color?: string;
  class?: string;
  id?: string;
  remove?: string;
  replace?: string;
  [key: string]: string;
}

export interface Position {
  lineStart: number;
  lineEnd: number;
}

export interface Action {
  type: string;
  payload: {
    files?: TFile[];
    currentFile?: TFile;
    fileCache?: CachedMetadata;
    button?: Button;
    content?: string;
  };
}

export interface State {
  currentFile: TFile | undefined;
  fileCache: CachedMetadata | undefined;
  files: TFile[] | undefined;
  buttons: Button[];
}

export interface NewState {
  currentFile?: TFile;
  fileCache?: CachedMetadata;
  files?: TFile[];
  buttons?: Button[];
}

interface Button {
  id: string;
  lineeStart: number;
  lineEnd: number;
  path: string;
  swap: number;
  args: Arguments;
}
