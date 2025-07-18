import { App, Notice, TFile } from "obsidian";
import { nameModal } from "../nameModal";
import templater from "../templater";

export const createNote = async (
  app: App,
  type: string,
  folder: string,
  prompt: string,
  filePath: TFile | string,
  isTemplater?: boolean,
): Promise<void> => {
  const path = type.match(/\(([\s\S]*?),?\s?(split|tab)?\)/);

  if (path) {
    let fullPath = `${path[1]}.md`;
    const fileName = fullPath.substring(fullPath.lastIndexOf("/"));

    // TODO: support folders with "folder" in the name
    // If a folder is provided in the button args, add it to the path
    fullPath = folder ? `${folder}/${fullPath}` : fullPath;

    const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
    // Check if the directory exists, if not, create it
    if (directoryPath && !app.vault.getAbstractFileByPath(directoryPath)) {
      console.log("trying to create folder at: ", directoryPath);
      await app.vault.createFolder(directoryPath);
    }

    try {
      if (prompt === "true") {
        const promptedName = await new Promise<string>((res) =>
          new nameModal(app, res, fileName).open()
        );
        fullPath = promptedName
          ? `${directoryPath}/${promptedName}.md`
          : fullPath;
      }
      
      let file: TFile;

      // Case 1: filePath is a string (file content)
      if (typeof filePath === "string") {
        file = await app.vault.create(fullPath, filePath);
      }
      // Case 2: filePath is a TFile (template file)
      else {
        if (isTemplater) {
          // For templater, create file with template content first
          const templateContent = await app.vault.read(filePath);
          file = await app.vault.create(fullPath, templateContent);
          
          // Then process with templater
          const runTemplater = await templater(app, filePath, file);
          const content = await app.vault.read(filePath);
          const processed = await runTemplater(content);
          await app.vault.modify(file, processed);
        } else {
          // For regular templates, create empty file first
          file = await app.vault.create(fullPath, "");
          
          // Then insert template content
          await app.internalPlugins?.plugins["templates"].instance
            .insertTemplate(filePath);
        }
      }

      // Open the file in the appropriate view
      if (path[2] === "split") {
        await app.workspace.getLeaf(true).openFile(file);
      } else if (path[2] === "tab") {
        await app.workspace.getLeaf(!0).openFile(file);
      } else {
        await app.workspace.getLeaf().openFile(file);
      }
    } catch (e) {
      console.error("Error in Buttons: ", e);
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
}; 