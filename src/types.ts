import { BlockCache } from "obsidian";

declare module "obsidian" {
  interface TAbstractFile {
    unsafeCachedData: string;
  }
  interface App {
    plugins: {
      plugins: {
        "templater-obsidian": {
          _loaded: boolean;
          settings: { template_folder: string, templates_folder: string };
        };
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

export interface ExtendedBlockCache extends BlockCache {
  path?: string;
  swap?: number;
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
