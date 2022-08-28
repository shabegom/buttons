import { templater } from "../src/utils";
import { App, Plugin_2 } from "obsidian";
import { activeFile } from "./helpers";

window.app = {
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

test("templater returns template", async () => {
  const templateString = "<% 'Hello World' %>";
  const runTemplater = await templater(activeFile);
  const template = await runTemplater(templateString);
  expect(template).toEqual("Hello World");
});

test("returns undefined if templater is not installed", async () => {
  window.app.plugins.plugins["templater-obsidian"] = undefined;
  const runTemplater = await templater(activeFile);
  expect(runTemplater).toBeUndefined();
});
