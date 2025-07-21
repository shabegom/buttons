import { App, Notice } from "obsidian";

import { Arguments, Position } from "../types";
import {
  appendContent,
  createNote,
  prependContent,
  addContentAtLine,
} from "../handlers";

export const template = async (
  app: App,
  args: Arguments,
  position: Position
): Promise<void> => {
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  const templaterPluginEnabled = app.plugins.plugins["templater-obsidian"];
  let isTemplater = false
  const templateFile = args.action.toLowerCase();
  const allFiles = app.vault.getFiles();
  let file = null

  if (templatesEnabled || templaterPluginEnabled) {
  if (templatesEnabled) {
    const folder: string = 
      templatesEnabled &&
        app.internalPlugins.plugins.templates.instance.options.folder?.toLowerCase()
    const isFound = allFiles.filter((file) => {
      let found = false;
          if (file.path.toLowerCase() === `${folder}/${templateFile}.md`) {
            found = true;
          }
        return found
    })
      file = isFound[0]
  }

  if (templaterPluginEnabled) {
    const folder: string = 
      templaterPluginEnabled &&
        app.plugins?.plugins[
          "templater-obsidian"
        ]?.settings.templates_folder?.toLowerCase()
    const isFound = allFiles.filter((file) => {
      let found = false;
          if (file.path.toLowerCase() === `${folder}/${templateFile}.md`) {
            found = true;
            isTemplater = true;
          }
      return found;
    })
      file = isFound[0]
  }

    if (file) {
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
    } else {
      new Notice(
        `Couldn't find the specified template, please check and try again`,
        2000
      );
    }
  } else {
    new Notice(
      "You need to have the Templates or Templater plugin enabled and Template folder defined",
      2000
    );
  }
}; 