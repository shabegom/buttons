import { App, Notice } from "obsidian";

interface Item {
  name: string;
  static_functions: Array<[string, () => unknown]>;
}

async function templater(app: App) {
  const file = app.workspace.getActiveFile();
  const config = {
    template_file: file,
    active_file: file,
    target_file: file,
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
  const userScriptFunctions =
    await templater.functions_generator.user_functions.user_script_functions.generate_user_script_functions();
  const userSystemFunctions =
    await templater.functions_generator.user_functions.user_system_functions.generate_system_functions(
      config
    );
  const functions = internalModuleArray.reduce(
    (acc: Record<string, unknown>, item: Item) => {
      acc[item.name] = Object.fromEntries(item.static_functions);
      return acc;
    },
    {}
  );
  functions.user = {};
  userScriptFunctions.forEach((value: () => unknown, key: string) => {
    functions.user[key] = value;
  });
  userSystemFunctions.forEach((value: () => unknown, key: string) => {
    functions.user[key] = value;
  });
  return async (command: string) => {
    return await templater.parser.parse_commands(command, functions);
  };
}

export default templater;
