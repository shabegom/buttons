import { Notice, TFile } from "obsidian";

type RunTemplater = (command: string) => Promise<string>;

interface Item {
  name: string;
  static_functions: Array<[string, () => unknown]>;
}

/**
 * Creates a templater function that can process templater commands
 * Based on the working implementation from cm6-rewrite branch
 * @param file - The file to use for templater context (optional, defaults to active file)
 * @returns A function that can process templater commands or undefined if Templater is not available
 */
async function templater(file?: TFile): Promise<RunTemplater | undefined> {
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
  
  // Access the templater instance directly from the plugin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { templater: templaterInstance } = plugins["templater-obsidian"] as any;
  
  // Generate internal functions
  const internalModuleArray =
    templaterInstance.functions_generator.internal_functions.modules_array;
  const functions = internalModuleArray.reduce(
    (acc: Record<string, unknown>, item: Item) => {
      acc[item.name] = Object.fromEntries(item.static_functions);
      return acc;
    },
    {}
  );
  
  // Initialize user functions object
  functions.user = {};
  
  // Generate user script functions
  const userScriptFunctions =
    await templaterInstance.functions_generator.user_functions.user_script_functions.generate_user_script_functions();
  userScriptFunctions.forEach((value: () => unknown, key: string) => {
    functions.user[key] = value;
  });
  
  // Generate user system functions if we have an active file
  if (activeFile) {
    const userSystemFunctions =
      await templaterInstance.functions_generator.user_functions.user_system_functions.generate_system_functions(
        config
      );
    userSystemFunctions.forEach((value: () => unknown, key: string) => {
      functions.user[key] = value;
    });
  }
  
  // Return the templater function
  return async (command: string) => {
    return await templaterInstance.parser.parse_commands(command, functions);
  };
}

/**
 * Process template content using Templater
 * @param file - The file to process as a template
 * @returns The processed content or undefined if processing fails
 */
export async function processTemplate(file: TFile): Promise<string | undefined> {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(); // No arguments - use active file as context
    
    if (runTemplater) {
      const processed = await runTemplater(content);
      return processed;
    }
  } catch (e) {
    console.error("Error processing template:", e);
    new Notice(`There was an error processing the template!`, 2000);
  }
  
  return undefined;
}

export default templater;
