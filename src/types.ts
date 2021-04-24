declare module "obsidian" {
  interface App {
    isMobile: boolean;
    internalPlugins: {
      plugins: {
        plugins: {
          "templater-obsidian": {};
        };
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
