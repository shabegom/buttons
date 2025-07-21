import { App, MarkdownView } from "obsidian";
import { createContentArray } from "../utils";
import { Position } from "../types";

export const removeSection = async (
  app: App,
  section: string,
  buttonPosition?: Position,
): Promise<void> => {
  const { contentArray, file } = await createContentArray(app);
  if (section.includes("[") && section.includes("]")) {
    const args = section.match(/\[(.*)\]/);
    if (args && args[1]) {
      // Handle special [cursor] syntax
      if (args[1].trim().toLowerCase() === "cursor") {
        const activeView = app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
          const editor = activeView.editor;
          const cursor = editor.getCursor();
          const cursorLine = cursor.line; // 0-based line number from editor
          
          // Remove the line at cursor position
          if (cursorLine >= 0 && cursorLine < contentArray.length) {
            contentArray.splice(cursorLine, 1);
            const content = contentArray.join("\n");
            await app.vault.modify(file, content);
          }
        }
        return;
      }
      
      const argArray = args[1].split(/,\s?/);
      if (argArray[0]) {
        let startLine: number; // This will be 1-based line number
        
        // Check for relative positioning syntax (+N or -N)
        const firstArgRelative = argArray[0].match(/^([+-])(\d+)$/);
        if (firstArgRelative && buttonPosition) {
          const operator = firstArgRelative[1];
          const offset = parseInt(firstArgRelative[2]);
          
          if (operator === '+') {
            // Remove N lines after the button (relative to button's end line)
            // buttonPosition.lineEnd is 0-based, so +1 makes it 1-based, then +offset
            startLine = buttonPosition.lineEnd + 1 + offset;
          } else {
            // Remove N lines before the button (relative to button's start line)  
            // buttonPosition.lineStart is 0-based, so +1 makes it 1-based, then -offset
            startLine = buttonPosition.lineStart + 1 - offset;
            // Ensure we don't go below line 1
            if (startLine < 1) {
              startLine = 1;
            }
          }
        } else {
          // Fall back to absolute line number parsing (already 1-based from user input)
          startLine = parseInt(argArray[0]);
        }
        
        // Convert to 0-based for array operations (following original pattern)
        const start = startLine - 1;
        
        // Handle single number case (e.g., "[5]" or "[+1]" - remove just one line)
        if (argArray.length === 1) {
          contentArray.splice(start, 1);
        } else {
          // Handle range case (e.g., "[5,10]" or "[+1,+3]" - remove a range of lines)
          let endLine: number; // This will be 1-based line number
          
          // Check if second argument is also relative
          const secondArgRelative = argArray[1].match(/^([+-])(\d+)$/);
          if (secondArgRelative && buttonPosition) {
            const operator = secondArgRelative[1];
            const offset = parseInt(secondArgRelative[2]);
            
            if (operator === '+') {
              // End N lines after the button (relative to button's end line)
              endLine = buttonPosition.lineEnd + 1 + offset;
            } else {
              // End N lines before the button (relative to button's start line)
              endLine = buttonPosition.lineStart + 1 - offset;
              if (endLine < 1) {
                endLine = 1;
              }
            }
          } else {
            // Fall back to absolute line number parsing (already 1-based from user input)
            endLine = parseInt(argArray[1]);
          }
          
          if (!isNaN(endLine)) {
            // Follow original pattern: end(1-based) - start(0-based) = numLines
            const numLines = endLine - start;
            if (numLines > 0) {
              contentArray.splice(start, numLines);
            }
          }
        }
        
        const content = contentArray.join("\n");
        await app.vault.modify(file, content);
      }
    }
  }
}; 