import { App, MarkdownView, Notice, TFile } from "obsidian";
import { ExtendedBlockCache } from "./types";
import { getStore } from "./buttonStore";
import { createContentArray, handleValueArray } from "./utils";
import { nameModal } from "./nameModal";
import { Z_FULL_FLUSH } from "node:zlib";

export const removeButton = async (
  app: App,
  remove: string,
  lineStart: number,
  lineEnd: number,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  const store = getStore(app.isMobile);
  if (remove === "true") {
    const numberOfItems = lineEnd - lineStart;
    contentArray.splice(lineStart, numberOfItems + 1);
    if (
      contentArray[lineStart] &&
      contentArray[lineStart].includes("^button-")
    ) {
      contentArray.splice(lineStart, 1);
    }
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
  }
  if (lineStart === lineEnd) {
    contentArray.splice(lineStart, 1);
    const content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    handleValueArray(remove, async (argArray) => {
      const buttons = store &&
        store.filter((item: ExtendedBlockCache) => {
          let exists;
          argArray.forEach((arg) => {
            if (item.id === `button-${arg}` && item.path === file.path) {
              exists = true;
            }
          });
          return exists;
        });
      if (buttons[0]) {
        let offset = 0;
        buttons.forEach((button: ExtendedBlockCache) => {
          const start = button.position.start.line - offset;
          const numLines = button.position.end.line -
            button.position.start.line;
          contentArray.splice(start, numLines + 2);
          offset += numLines + 2;
        });
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    });
  }
};

export const removeSection = async (
  app: App,
  section: string,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  if (section.includes("[") && section.includes("]")) {
    const args = section.match(/\[(.*)\]/);
    if (args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        const start = parseInt(argArray[0]) - 1;
        const end = parseInt(argArray[1]);
        const numLines = end - start;
        contentArray.splice(start, numLines);
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    }
  }
};

export const prependContent = async (
  app: App,
  insert: string,
  lineStart: number,
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    contentArray.splice(lineStart, 0, insert);
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue prepending content, please try again", 2000);
  }
};

export const appendContent = async (
  app: App,
  insert: string,
  lineEnd: number,
): Promise<void> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    let content = await app.vault.read(file);
    const contentArray = content.split("\n");
    let insertionPoint;
    if (
      contentArray[lineEnd + 1] &&
      contentArray[lineEnd + 1].includes("^button")
    ) {
      insertionPoint = lineEnd + 2;
      insert = `\n${insert}`;
    } else {
      insertionPoint = lineEnd + 1;
    }
    contentArray.splice(insertionPoint, 0, `${insert}`);
    content = contentArray.join("\n");
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue appending content, please try again", 2000);
  }
};

export const addContentAtLine = async (
  app: App,
  insert: string,
  type: string,
): Promise<void> => {
  const lineNumber = type.match(/(\d+)/g);
  if (lineNumber[0]) {
    const insertionPoint = parseInt(lineNumber[0]) - 1;
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const file = activeView.file;
      let content = await app.vault.read(file);
      const contentArray = content.split("\n");
      contentArray.splice(insertionPoint, 0, `${insert}`);
      content = contentArray.join("\n");
      await app.vault.modify(file, content);
    }
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
};

export const createNote = async (
  app: App,
  content: string,
  type: string,
  folder: string,
  prompt: string,
  filePath?: TFile,
  templater?: string,
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
      console.log("trying to create folder at: ", directoryPath)
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

      await app.vault.create(fullPath, content);
      const file = app.vault.getAbstractFileByPath(fullPath) as TFile;

      if (path[2] === "split") {
        await app.workspace.splitActiveLeaf().openFile(file);
      } else if (path[2] === "tab") {
        await app.workspace.getLeaf(!0).openFile(file);
      } else {
        await app.workspace.getLeaf().openFile(file);
      }
      // I don't know what this was supposed to do...
      // if (filePath) {
      //   if (templater) {
      //     (app as any).plugins.plugins["templater-obsidian"].templater
      //       .append_template_to_active_file(filePath);
      //   } else {
      //     (app as any).internalPlugins?.plugins["templates"].instance
      //       .insertTemplate(filePath);
      //   }
      // }
    } catch (e) {
      console.error("Error in Buttons: ", e);
      new Notice("There was an error! Maybe the file already exists?", 2000);
    }
  } else {
    new Notice(`couldn't parse the path!`, 2000);
  }
};
