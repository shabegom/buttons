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
  _templateFile: TFile,
  targetFile: TFile,
): Promise<RunTemplater | undefined> {
  // Check if Templater plugin is installed and enabled
  const templaterPlugin = app.plugins.plugins["templater-obsidian"];
  
  if (!templaterPlugin) {
    new Notice("Templater plugin not found. Please install and enable it.");
    return;
  }

  // Check if the plugin is loaded and enabled
  if (!templaterPlugin._loaded) {
    new Notice("Templater plugin is not loaded.");
    return;
  }

  try {
    // Return a function that processes templater commands
    return async (content: string): Promise<string> => {
      try {
        // Save current content of target file
        const originalContent = await app.vault.read(targetFile);
        
        // Write the template content to the file
        await app.vault.modify(targetFile, content);
        
        // Wait a bit for the file to be updated
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Execute the templater command to process the content
        await app.commands.executeCommandById("templater-obsidian:replace-in-file-templater");
        
        // Wait a bit for processing to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Read the processed content
        const processedContent = await app.vault.read(targetFile);
        
        // Restore original content
        await app.vault.modify(targetFile, originalContent);
        
        return processedContent;
        
      } catch (error) {
        console.error("Error processing Templater commands:", error);
        new Notice("Error processing template. Check console for details.");
        return content; // Return original content if processing fails
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
