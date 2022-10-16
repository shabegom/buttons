import { Args, ButtonCache } from "../src/types";
import { App, Plugin_2, Pos, TFile, TFolder, Vault } from "obsidian";

export const position: Pos = {
  start: { line: 0, col: 0, offset: 0 },
  end: { line: 0, col: 0, offset: 0 },
};

export const buttonCodeblock = `name Testing Button\ntype command\naction Toggle Pin\nid test-button\nclass button\ncolor blue`;

export const argsObject: Args = {
  name: "Testing Button",
  type: "command",
  action: "Toggle Pin",
  id: "test-button",
  class: "button",
  color: "blue",
};

export const activeFile: TFile = {
  stat: { ctime: 1, mtime: 1, size: 1 },
  basename: "test.md",
  extension: "md",
  path: "test.md",
  vault: "" as unknown as Vault,
  name: "",
  parent: "" as unknown as TFolder,
};
export const testButton: ButtonCache = {
  file: activeFile.path,
  args: argsObject,
  position,
  id: "test-button",
};

export const testSwap = {
  id: 0,
  buttons: [testButton],
  currentButtonIndex: 0,
};

export const manifest = {
  id: "buttons",
  name: "Buttons",
  description:
    "Create Buttons in your Obsidian notes to run commands, open links, and insert templates",
  version: "1.0.0",
  author: "shabegom",
  authorUrl: "https://shbgm.ca",
  isDesktopOnly: false,
  minAppVersion: "0.12.8",
};

export const sectionContent = `\`\`\`button
${buttonCodeblock}
\`\`\`
^button-test-button
`;

const testInlineButton = Object.assign({}, testButton);
testInlineButton.inline = true;
testInlineButton.inlinePosition = testButton.position;

export const plugin = {
  swapCache: [testSwap],
  errors: [],
  index: [testButton],
  inlineIndex: [testInlineButton],
  noteChanged: 0,
  cacheChanged: 0,
};

export const command = { name: "Toggle Pin", id: "toggle-pin" };

export const app = {
  commands: {
    commands: {
      "toggle-pin": command,
    },
    listCommands: () => [command],
    executeCommandById: (id: string) => id,
  },
  plugins: {
    plugins: {
      "templater-obsidian": {
        templater: {
          parser: {
            parse_commands: (command: string) => {
              const parsed = command.replace(/<% '(Hello World)' %>/, "$1");
              return Promise.resolve(parsed);
            },
          },
          functions_generator: {
            internal_functions: {
              modules_array: [],
            },
            user_functions: {
              user_system_functions: {
                generate_system_functions: () => Promise.resolve([]),
              },
              user_script_functions: {
                generate_user_script_functions: async (): Promise<[]> => [],
              },
            },
          },
        },
      } as unknown as Plugin_2,
    },
  },
} as unknown as App;
