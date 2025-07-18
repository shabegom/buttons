import { App, MarkdownView, Notice } from "obsidian";
import mexp from "math-expression-evaluator";

import { Arguments, Position } from "../types";
import { appendContent } from "../handlers";
import { findNumber } from "../parser";

export const calculate = async (
  app: App,
  { action }: Arguments,
  position: Position
): Promise<void> => {
  let equation = action;
  const variables = action.match(/\$[0-9]*/g);
  if (variables) {
    const output = variables.map(async (value) => {
      const activeView = app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        const lineNumber = parseInt(value.substring(1));
        const numbers = await findNumber(app, lineNumber);
        return { variable: value, numbers };
      } else {
        new Notice(`couldn't read file`, 2000);
      }
    });
    const resolved = await Promise.all(output);
    resolved.forEach((term: { variable: string; numbers: string[] }) => {
      if (term.numbers) {
        equation = equation.replace(term.variable, term.numbers.join(""));
      } else {
        new Notice("Check the line number in your calculate button", 3000);
        equation = undefined;
      }
    });
  }
  const fun = equation && mexp.eval(equation);
  if (fun !== null && fun !== undefined) {
    appendContent(app, `Result: ${fun}`, position.lineEnd, false);
  }
}; 