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

      if (typeof filePath === "string") {
        file = await app.vault.create(fullPath, filePath);
      }

      const templateContent = await app.vault.read(filePath as TFile);
      if (isTemplater) {
        file = await app.vault.create(fullPath, templateContent);
        const runTemplater = await templater(app, filePath as TFile, file);
        const content = await app.vault.read(filePath as TFile);
        const processed = await runTemplater(content);
        await app.vault.modify(file, processed);
      }
      if (!isTemplater && typeof filePath !== "string") {
        file = await app.vault.create(fullPath, "");
      }

      if (path[2] === "split") {
        await app.workspace.splitActiveLeaf().openFile(file);
      } else if (path[2] === "tab") {
        await app.workspace.getLeaf(!0).openFile(file);
      } else {
        await app.workspace.getLeaf().openFile(file);
      }
      if (!isTemplater && typeof filePath !== "string") {
        await app.internalPlugins?.plugins["templates"].instance
          .insertTemplate(filePath);
      }
    } catch (e) {
      console.error("Error in Buttons: ", e);
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
}; 