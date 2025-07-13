import { Notice, TFile } from "obsidian";

type RunTemplater = (command: string) => Promise<string>;

async function templater(
  template: TFile,
  target: TFile,
): Promise<RunTemplater | undefined> {
  const config = {
    template_file: template,
    active_file: app.workspace.getActiveFile(),
    target_file: target,
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
  const functions = await templater.functions_generator.internal_functions.generate_object(config)

  functions.user = {};
  const userScriptFunctions = await templater.functions_generator.user_functions
    .user_script_functions.generate_user_script_functions(config);
  userScriptFunctions.forEach((value: () => unknown, key: string) => {
    functions.user[key] = value;
  });
  if (template) {
    const userSystemFunctions = await templater.functions_generator
      .user_functions.user_system_functions.generate_system_functions(
        config,
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
    const runTemplater = await templater(file, file);
    if (runTemplater) {
      const processed = await runTemplater(content);
      return processed;
    }
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

export default templater;
