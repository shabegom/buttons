import { Node } from "unist";

declare module "obsidian" {
  interface App {
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
    };
  }
}

export interface ButtonNode extends Node {
  value: string;
}

export interface TextNode extends Node {
  value: string;
}

export interface Args {
  name: string;
  id?: string;
  type: string;
  action: string;
  color?: string;
  class?: string;
  replace?: string | string[];
  remove?: string | string[];
  parent?: boolean;
}

export interface Button {
  start: number;
  end: number;
  args: Args;
  id: string;
  index?: number;
  path: string;
}
