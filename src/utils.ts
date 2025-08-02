import { MarkdownView, App, Notice, TFile } from "obsidian";
import { Arguments, Position } from "./types";
import { addButtonToStore } from "./buttonStore";

function nanoid(num: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface OutputObject {
  name: string;
  type: string;
  action: string;
  swap: string;
  remove: string;
  replace: string;
  id: string;
  templater: boolean;
  class: string;
  color: string;
  customColor: string;
  customTextColor: string;
  blockId: string;
  folder: string;
  prompt: boolean;
  openMethod: string; // Add field for note opening method (split, tab, etc.)
  noteTitle: string; // Add field for note title (separate from template name in action)
  actions?: { type: string; action: string }[]; // Add actions field for chain buttons
}

export const insertButton = (app: App, outputObject: OutputObject): void => {
  const buttonArr = [];
  buttonArr.push("```button");
  outputObject.name && buttonArr.push(`name ${outputObject.name}`);
  
  // Handle type generation for note buttons with opening methods
  if (outputObject.type && outputObject.type.includes("note") && outputObject.noteTitle && outputObject.openMethod) {
    const noteType = `note(${outputObject.noteTitle}, ${outputObject.openMethod}) ${outputObject.type.replace("note ", "")}`;
    buttonArr.push(`type ${noteType}`);
    // Add action field for note buttons as it's needed by the template system
    outputObject.action && buttonArr.push(`action ${outputObject.action}`);
  } else {
    outputObject.type && buttonArr.push(`type ${outputObject.type}`);
    outputObject.action && buttonArr.push(`action ${outputObject.action}`);
  }
  
  outputObject.id && buttonArr.push(`id ${outputObject.id}`);
  outputObject.swap && buttonArr.push(`swap ${outputObject.swap}`);
  outputObject.remove && buttonArr.push(`remove ${outputObject.remove}`);
  outputObject.replace && buttonArr.push(`replace ${outputObject.replace}`);
  outputObject.templater === true &&
    buttonArr.push(`templater ${outputObject.templater}`);
  outputObject.color && buttonArr.push(`color ${outputObject.color}`);
  outputObject.customColor && buttonArr.push(`customColor ${outputObject.customColor}`);
  outputObject.customTextColor && buttonArr.push(`customTextColor ${outputObject.customTextColor}`);
  outputObject.class && buttonArr.push(`class ${outputObject.class}`);
  outputObject.folder && buttonArr.push(`folder ${outputObject.folder}`);
  outputObject.prompt && buttonArr.push(`prompt ${outputObject.prompt}`);
  // Handle actions array for chain buttons
  if (outputObject.actions && Array.isArray(outputObject.actions) && outputObject.actions.length > 0) {
    buttonArr.push(`actions ${JSON.stringify(outputObject.actions)}`);
  }
  buttonArr.push("```");
  outputObject.blockId
    ? buttonArr.push(`^button-${outputObject.blockId}`)
    : buttonArr.push(`^button-${nanoid(4)}`);
  const page = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = page.editor;
  editor.replaceSelection(buttonArr.join("\n"));
  addButtonToStore(app, page.file);
};

export const insertInlineButton = (app: App, id: string): void => {
  const page = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = page.editor;
  editor.replaceSelection(`\`button-${id}\``);
};

export const createArgumentObject = (source: string): Arguments => {
  const lines = source.split("\n");
  const acc: Arguments = {};
  
  // Define known button argument keys for validation
  const knownArguments = new Set([
    "name", "type", "action", "id", "swap", "remove", "replace", 
    "templater", "color", "customcolor", "customtextcolor", "class", 
    "folder", "prompt", "actions", "width", "height", "align"
  ]);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const split: string[] = line.split(" ");
    const key: string = split[0]?.toLowerCase();
    if (!key) continue;
    
    if (key === "name") {
      // Collect all lines for the name (written using markdown)
      const parseLines = [line.replace(/^name\s*/, "")];

      let destructor = parseMultiLine(lines, i, parseLines);
      if (destructor.parseValue[0] == "{") {
        acc[key] = destructor.parseValue.slice(1, -1).trim();
      } else {
        acc[key] = destructor.parseValue.trim();
      }
      i = destructor.i;
      
    } else if (key === "actions") {
      // Collect all lines for the JSON array
      const jsonLines = [line.replace(/^actions\s*/, "")];

      let destructor = parseMultiLine(lines, i, jsonLines);
      try {
        new Notice(`Actions: ${destructor.parseValue}`, 0);
        acc[key] =  JSON.parse(destructor.parseValue);
      } catch (e) {
        acc[key] = [];
        new Notice(`Error: Malformed JSON in actions field. Please check your chain button syntax.`, 4000);
      }
      i = destructor.i;

    } else if (key === "action") {
      // Handle multi-line actions
      const actionLines = [line.replace(/^action\s*/, "")];
      
      // Continue reading lines until we hit another argument or end of button block
      while (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        
        // Check if this is the end of the button block
        if (nextLine.startsWith("```")) {
          break;
        }
        
        // Check if this line starts a new argument
        // Skip empty lines (they're part of the action content)
        if (nextLine.trim() !== "" && !nextLine.startsWith(" ") && !nextLine.startsWith("\t")) {
          const potentialKey = nextLine.split(" ")[0]?.toLowerCase();
          if (knownArguments.has(potentialKey)) {
            break; // This is a new argument
          }
        }
        
        // This line is part of the action content
        i++;
        actionLines.push(nextLine);
      }
      
      // Join the lines and trim only trailing whitespace to preserve intentional formatting
      const actionContent = actionLines.join("\n").replace(/\s+$/, "");
      acc[key] = actionContent;
    } else {
      // Handle all other single-line arguments (backward compatibility)
      const value = split.slice(1).join(" ").trim();
      acc[key] = value;
    }
  }
  return acc;
};

export const createContentArray = async (
  app: App
): Promise<{ contentArray: string[]; file: TFile }> => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const content = await app.vault.read(file);
    return { contentArray: content.split("\n"), file };
  }
  new Notice("Could not get Active View", 1000);
  console.error("could not get active view");
};

export const handleValueArray = (
  value: string,
  callback: (argArray: string[]) => void
): void => {
  if (value.includes("[") && value.includes("]")) {
    const args = value.match(/\[(.*)\]/);
    if (args[1]) {
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        callback(argArray);
      }
    }
  }
};

export async function getNewArgs(
  app: App,
  position: Position
): Promise<{ args: Arguments }> {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const newContent = await app.vault
    .cachedRead(activeView.file)
    .then((content: string) => content.split("\n"));
  const newButton = newContent
    .splice(position.lineStart, position.lineEnd - position.lineStart)
    .join("\n")
    .replace("```button", "")
    .replace("```", "");
  return { args: createArgumentObject(newButton) };
}

export const wrapAround = (value: number, size: number): number => {
  return ((value % size) + size) % size;
};

/**
 * Run Templater's "Replace templates in the active file" command and wait until complete.
 */
export const runTemplater = (
  app: App
): Promise<{
  file: TFile;
  content: string;
}> =>
  new Promise((resolve) => {
    const ref = app.workspace.on(
      "templater:overwrite-file" as any,
      (file: TFile, content: string) => {
        app.workspace.offref(ref);
        resolve({ file, content });
      }
    );
    app.commands.executeCommandById(
      "templater-obsidian:replace-in-file-templater"
    );
  });


// Refactoring of the code to reduce duplication and improve readability
export const parseMultiLine = (lines: string[], iStart: number, parseLinesStart: string[]): any => {
  
  // Robust JSON parsing that handles all bracket types and string literals
  let i = iStart;
  let parseLines = parseLinesStart;
  let bracketCount = 0;
  let braceCount = 0;
  let inString = false;
  let escaped = false;
  let parseValue;
  
  // Count brackets in the first line
  for (const char of parseLines[0]) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '[') bracketCount++;
      else if (char === ']') bracketCount--;
      else if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
    }
  }
  
  // Continue reading lines until all brackets and braces are balanced
  while ((bracketCount > 0 || braceCount > 0) && i + 1 < lines.length) {
    i++;
    const nextLine = lines[i];
    parseLines.push(nextLine);
    
    // Count brackets in the new line
    for (const char of nextLine) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === '"' && !escaped) {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '[') bracketCount++;
        else if (char === ']') bracketCount--;
        else if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
      }
    }
  }
  
  const parseString = parseLines.join("\n").trim();
  parseValue = parseString;

  return { parseValue, i };

}