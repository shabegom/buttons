import { Notice, TFile } from "obsidian";

interface Item {
  name: string;
  static_functions: Array<[string, () => unknown]>;
}

async function templater(file?: TFile) {
  const activeFile = file ? file : app.workspace.getActiveFile();
  const config = {
    template_file: activeFile,
    active_file: activeFile,
    target_file: activeFile,
    run_mode: "DynamicProcessor",
  };
  const plugins = app.plugins.plugins;
  const exists = plugins["templater-obsidian"];
  if (!exists) {
    new Notice("Templater is not installed. Please install it.");
    return;
  }
  // eslint-disable-next-line
  // @ts-ignore
  const { templater } = plugins["templater-obsidian"];
  const internalModuleArray =
    templater.functions_generator.internal_functions.modules_array;
  const functions = internalModuleArray.reduce(
    (acc: Record<string, unknown>, item: Item) => {
      acc[item.name] = Object.fromEntries(item.static_functions);
      return acc;
    },
    {}
  );
  functions.user = {};
  const userScriptFunctions =
    await templater.functions_generator.user_functions.user_script_functions.generate_user_script_functions();
  userScriptFunctions.forEach((value: () => unknown, key: string) => {
    functions.user[key] = value;
  });
  if (activeFile) {
    const userSystemFunctions =
      await templater.functions_generator.user_functions.user_system_functions.generate_system_functions(
        config
      );
    userSystemFunctions.forEach((value: () => unknown, key: string) => {
      functions.user[key] = value;
    });
  }
  return async (command: string) => {
    return await templater.parser.parse_commands(command, functions);
  };
}

export async function processTemplate(file: TFile) {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(file);
    const processed = await runTemplater(content);
    return processed;
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

export default templater;
