import { templater } from "../src/utils";
import { activeFile, app } from "./helpers";
window.app = app;

test("templater returns template", async () => {
  const templateString = "<% 'Hello World' %>";
  const runTemplater = await templater(activeFile);
  const template = await runTemplater(templateString);
  expect(template).toEqual("Hello World");
});

test("returns undefined if templater is not installed", async () => {
  window.app.plugins.plugins["templater-obsidian"] = undefined;
  const runTemplater = await templater(activeFile);
  expect(runTemplater).toBeUndefined();
});
