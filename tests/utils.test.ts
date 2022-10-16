import { combine, createArgs } from "../src/utils";
import { Args } from "../src/types";

const buttonCodeblock = `name Testing Button\ntype command\naction Toggle Pin\nid test-button\nclass button\ncolor blue`;
const argsObject: Args = {
  name: "Testing Button",
  type: "command",
  action: "Toggle Pin",
  id: "test-button",
  class: "button",
  color: "blue",
};

test("createArgs returns arguments object", () => {
  const parsedArgs = createArgs(buttonCodeblock);
  expect(parsedArgs).toEqual(argsObject);
});

test("createArgs returns arguments object with multiple mutations", () => {
  const buttonCodeblockWithMutations = buttonCodeblock.concat(
    "\nremove [1,2,3]\nreplace [1,2]"
  );
  argsObject.mutations = [
    { type: "remove", value: "[1,2,3]" },
    { type: "replace", value: "[1,2]" },
  ];
  const parsedArgs = createArgs(buttonCodeblockWithMutations);
  expect(parsedArgs).toEqual(argsObject);
});

test("combine takes an array of functions and returns a function", () => {
  const func = () => {
    "foo";
  };
  const array = [func, func];
  const combinedFunction = combine(...array);
  expect(typeof combinedFunction).toBe("function");
});
