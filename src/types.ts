import { Plugin, Pos } from "obsidian";

declare module "obsidian" {
  interface App {
    plugins: {
      plugins: {
        [name: string]: ExtendedPlugin;
      };
    };
    commands: {
      executeCommandById: (id: string) => unknown;
      listCommands: () => [{ id: string; name: string }];
      commands: Record<string, { name: string; id: string }>;
    };
  }
}

interface ExtendedPlugin extends Plugin {
  settings: {
    template_folder: string;
  };
}

interface Mutation {
  type: string;
  value: string;
}

export interface Args {
  name?: string;
  type?: string;
  action?: string;
  mutations?: Mutation[];
  id?: string;
  class?: string;
  color?: string;
}

export interface ButtonCache {
  file?: string;
  args?: Args;
  button?: string;
  position: Pos;
  inline?: boolean;
  inlinePosition?: Pos;
  id: string;
}

export interface PageCache {
  args: Args;
  button: string;
  position: Pos;
  id: string;
}

export interface SwapCache {
  id: string;
  buttons: ButtonCache[];
  currentButtonIndex: number;
}
