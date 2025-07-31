import { App, Notice, TFile } from "obsidian";

type RunTemplater = (command: string) => Promise<string>;

async function templater(
  app: App,
  template: TFile,
  _target: TFile,
): Promise<RunTemplater | undefined> {
  // For inline templater processing in buttons, use the same file for all config properties
  const activeFile = template || app.workspace.getActiveFile();
  
  if (!activeFile) {
    new Notice("No active file found for templater processing.");
    return;
  }
  
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
  
  try {
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
    if (activeFile) {
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
  } catch (error) {
    console.error('Error setting up templater functions:', error);
    new Notice("Error setting up templater functions. Check console for details.");
    return;
  }
}

export async function processTemplate(app: App, file: TFile) {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(app, file, file);
    if (runTemplater) {
      const processed = await runTemplater(content);
      return processed;
    }
  } catch (e) {
    new Notice(`There was an error processing the template!`, 2000);
  }
}

export default templater;
