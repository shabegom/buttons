import {
  buttonCodeblock,
  sectionContent,
  testButton,
  testPlugin,
} from "./helpers";

test("test suite runs", () => {
  const testRuns = true;
  expect(testRuns).toBeTruthy();
});

test("getCurrentButton returns the current button in the file", () => {
  testPlugin.currentFileButtons = [testButton];
  const currentButton = testPlugin.getCurrentButton(
    buttonCodeblock,
    sectionContent
  );
  expect(currentButton).toEqual(testButton);
});
