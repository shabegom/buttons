import { App, Notice, TFile } from "obsidian";

type RunTemplater = (command: string) => Promise<string>;

/**
 * Creates a templater function that can process templater commands
 * @param app - The Obsidian app instance
 * @param templateFile - The template file (for context)
 * @param targetFile - The target file where the template will be applied
 * @returns A function that can process templater commands or undefined if Templater is not available
 */
async function templater(
  app: App,
  templateFile: TFile,
  targetFile: TFile,
): Promise<RunTemplater | undefined> {
  // Check if Templater plugin is installed and enabled
  const templaterPlugin = app.plugins.plugins["templater-obsidian"];
  
  if (!templaterPlugin) {
    new Notice("Templater plugin not found. Please install and enable it.");
    return;
  }

  // Check if the plugin is loaded and has the expected API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const templaterAPI = (templaterPlugin as any).templater;
  
  if (!templaterAPI) {
    new Notice("Templater plugin is not properly loaded.");
    return;
  }

  try {
    // Return a function that processes templater commands
    return async (content: string): Promise<string> => {
      try {
        // Method 1: Try using parse_template if available
        if (typeof templaterAPI.parse_template === 'function') {
          const result = await templaterAPI.parse_template(
            {
              template_file: templateFile,
              target_file: targetFile,
              active_file: targetFile,
            },
            content
          );
          return result || content;
        }
        
        // Method 2: Try using the parser directly if available
        if (templaterAPI.parser && typeof templaterAPI.parser.parse_commands === 'function') {
          // Check if we can get or create functions object
          let functionsObject = templaterAPI.current_functions_object;
          
          if (!functionsObject && templaterAPI.functions_generator) {
            // Try to generate functions
            const config = {
              template_file: templateFile,
              target_file: targetFile,
              active_file: targetFile,
            };
            
            try {
              if (templaterAPI.functions_generator.internal_functions) {
                await templaterAPI.functions_generator.internal_functions.generate_object(config);
              }
              if (templaterAPI.functions_generator.user_functions) {
                await templaterAPI.functions_generator.user_functions.generate_user_script_functions(config);
              }
              functionsObject = templaterAPI.current_functions_object;
            } catch (genError) {
              console.warn("Could not generate templater functions:", genError);
            }
          }
          
          if (functionsObject) {
            const result = await templaterAPI.parser.parse_commands(content, functionsObject);
            return result || content;
          }
        }
        
        // Method 3: Fallback to command execution
        throw new Error("No suitable templater API method found, falling back to command execution");
        
      } catch (parseError) {
        console.error("Error parsing Templater commands:", parseError);
        
        // Fallback: try using the command execution approach
        try {
          // Save current content temporarily
          const originalContent = await app.vault.read(targetFile);
          
          // Write the template content to the file
          await app.vault.modify(targetFile, content);
          
          // Execute the templater command
          await app.commands.executeCommandById("templater-obsidian:replace-in-file-templater");
          
          // Read the processed content
          const processedContent = await app.vault.read(targetFile);
          
          // Restore original content
          await app.vault.modify(targetFile, originalContent);
          
          return processedContent;
        } catch (fallbackError) {
          console.error("Fallback templater processing failed:", fallbackError);
          new Notice("Error processing template. Check console for details.");
          return content; // Return original content if all fails
        }
      }
    };
    
  } catch (error) {
    console.error('Error setting up templater:', error);
    new Notice("Error setting up Templater. Check console for details.");
    return;
  }
}

/**
 * Process template content using Templater
 * @param app - The Obsidian app instance
 * @param file - The file to process as a template
 * @returns The processed content or undefined if processing fails
 */
export async function processTemplate(app: App, file: TFile): Promise<string | undefined> {
  try {
    const content = await app.vault.read(file);
    const runTemplater = await templater(app, file, file);
    
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
