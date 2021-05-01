import { BlockCache, TFile } from "obsidian";

declare module "obsidian" {
  interface App {
    plugins: {
      plugins: {
        "templater-obsidian": { settings: { template_folder: string } };
      };
      isMobile: boolean;
      internalPlugins: {
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
    };
  }
}

export interface ExtendedBlockCache extends BlockCache {
  path?: string;
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
