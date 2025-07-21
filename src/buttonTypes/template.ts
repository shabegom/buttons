import { App, Notice, TFile } from "obsidian";

import { Arguments, Position } from "../types";
import {
  appendContent,
  createNote,
  prependContent,
  addContentAtLine,
  addContentAtCursor,
} from "../handlers";

interface TemplateSearchResult {
  file: TFile | null;
  isTemplater: boolean;
  source: string; // 'core', 'templater', or 'none'
}

/**
 * Search for templates in both core Templates and Templater plugin folders
 */
const findTemplate = (
  app: App,
  templateFile: string,
  templatesEnabled: boolean,
  templaterPluginEnabled: boolean
): TemplateSearchResult => {
  const allFiles = app.vault.getFiles();
  const results: Array<{ file: TFile; source: string; isTemplater: boolean }> = [];

  // Search in core Templates folder
  if (templatesEnabled) {
    const folder = app.internalPlugins.plugins.templates.instance.options.folder;
    
    if (folder) {
      const folderLower = folder.toLowerCase();
      const coreTemplateFile = allFiles.find((file) => 
        file.path.toLowerCase() === `${folderLower}/${templateFile}.md`
      );
      
      if (coreTemplateFile) {
        results.push({ 
          file: coreTemplateFile, 
          source: 'core', 
          isTemplater: false 
        });
      }
    }
  }

  // Search in Templater plugin folder
  if (templaterPluginEnabled) {
    const templaterPlugin = app.plugins?.plugins["templater-obsidian"];
    const folder = templaterPlugin?.settings?.templates_folder;
    
    if (folder) {
      const folderLower = folder.toLowerCase();
      const templaterFile = allFiles.find((file) => 
        file.path.toLowerCase() === `${folderLower}/${templateFile}.md`
      );
      
      if (templaterFile) {
        results.push({ 
          file: templaterFile, 
          source: 'templater', 
          isTemplater: true 
        });
      }
    }
  }

  // Handle results based on what was found
  if (results.length === 0) {
    return { file: null, isTemplater: false, source: 'none' };
  } else if (results.length === 1) {
    const result = results[0];
    return { 
      file: result.file, 
      isTemplater: result.isTemplater, 
      source: result.source 
    };
  } else {
    // Multiple templates found - prefer Templater over core Templates
    const templaterResult = results.find(r => r.source === 'templater');
    const coreResult = results.find(r => r.source === 'core');
    
    if (templaterResult && coreResult) {
      new Notice(
        `Found template "${templateFile}" in both Core Templates and Templater folders. Using Templater version.`,
        3000
      );
      return { 
        file: templaterResult.file, 
        isTemplater: templaterResult.isTemplater, 
        source: templaterResult.source 
      };
    }
    
    // Fallback to first result (shouldn't happen with current logic)
    const result = results[0];
    return { 
      file: result.file, 
      isTemplater: result.isTemplater, 
      source: result.source 
    };
  }
};

export const template = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPluginEnabled = !!app.plugins.plugins["templater-obsidian"];
  const templateFile = args.action.toLowerCase();

  if (!templatesEnabled && !templaterPluginEnabled) {
    new Notice(
      "You need to have the Templates or Templater plugin enabled and Template folder defined",
      2000
    );
    return;
  }

  const searchResult = findTemplate(app, templateFile, templatesEnabled, templaterPluginEnabled);
  
  if (!searchResult.file) {
    const availableFolders: string[] = [];
    
    if (templatesEnabled) {
      const coreFolder = app.internalPlugins.plugins.templates.instance.options.folder;
      if (coreFolder) availableFolders.push(`Core Templates: ${coreFolder}`);
    }
    
    if (templaterPluginEnabled) {
      const templaterPlugin = app.plugins?.plugins["templater-obsidian"];
      const templaterFolder = templaterPlugin?.settings?.templates_folder;
      if (templaterFolder) availableFolders.push(`Templater: ${templaterFolder}`);
    }
    
    const folderList = availableFolders.length > 0 
      ? `\n\nSearched in: ${availableFolders.join(', ')}` 
      : '';
    
    new Notice(
      `Couldn't find template "${templateFile}.md" in any configured template folder.${folderList}`,
      4000
    );
    return;
  }

  // Execute the appropriate template action
  const { file, isTemplater } = searchResult;
  
  try {
    // prepend template above the button
    if (args.type.includes("prepend")) {
      await prependContent(app, file, position.lineStart, isTemplater);
    }
    // append template below the button
    if (args.type.includes("append")) {
      await appendContent(app, file, position.lineEnd, isTemplater);
    }
    if (args.type.includes("note")) {
      createNote(app, args.type, args.folder, args.prompt, file, isTemplater);
    }
    if (args.type.includes("line")) {
      await addContentAtLine(app, file, args.type, isTemplater, position);
    }
    if (args.type.includes("cursor")) {
      await addContentAtCursor(app, file, isTemplater);
    }
  } catch (error) {
    console.error('Error executing template action:', error);
    new Notice(
      `Error executing template "${templateFile}". Check console for details.`,
      3000
    );
  }
}; 