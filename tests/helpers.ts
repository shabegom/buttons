import Buttons from "../src/main";
import { Args, ButtonCache } from "../src/types";
import { Pos, TFile, TFolder, Vault } from "obsidian";

export const position: Pos = {
  start: { line: 0, col: 0, offset: 0 },
  end: { line: 0, col: 0, offset: 0 },
};

export const buttonCodeblock = `name Testing Button\ntype command\naction Toggle Pin\nid test-button\nclass button\ncolor blue`;

export const argsObject: Args = {
  name: "Testing Button",
  type: "command",
  action: "Toggle Pin",
  id: "test-button",
  class: "button",
  color: "blue",
};

export const activeFile: TFile = {
  stat: { ctime: 1, mtime: 1, size: 1 },
  basename: "test.md",
  extension: "md",
  path: "test.md",
  vault: "" as unknown as Vault,
  name: "",
  parent: "" as unknown as TFolder,
};
export const testButton: ButtonCache = {
  file: activeFile,
  args: argsObject,
  position,
  id: "test-button",
};

const manifest = {
  id: "buttons",
  name: "Buttons",
  description:
    "Create Buttons in your Obsidian notes to run commands, open links, and insert templates",
  version: "1.0.0",
  author: "shabegom",
  authorUrl: "https://shbgm.ca",
  isDesktopOnly: false,
  minAppVersion: "0.12.8",
};

export const testPlugin = new Buttons(window.app, manifest);

export const sectionContent = `\`\`\`button
${buttonCodeblock}
\`\`\`
^button-test-button
`;
