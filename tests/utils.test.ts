import { combine, createArgs } from "../src/utils";
import { argsObject as object, buttonCodeblock } from "./helpers";

test("createArgs returns arguments object", () => {
  const parsedArgs = createArgs(buttonCodeblock);
  expect(parsedArgs).toEqual(object);
});

test("createArgs returns arguments object with multiple mutations", () => {
  const buttonCodeblockWithMutations = buttonCodeblock.concat(
    "\nremove [1,2,3]\nreplace [1,2]"
  );
  object.mutations = [
    { type: "remove", value: "[1,2,3]" },
    { type: "replace", value: "[1,2]" },
  ];
  const parsedArgs = createArgs(buttonCodeblockWithMutations);
  expect(parsedArgs).toEqual(object);
});

test("combine takes an array of functions and returns a function", () => {
  const func = () => {
    "foo";
  };
  const array = [func, func];
  const combinedFunction = combine(...array);
  expect(typeof combinedFunction).toBe("function");
});
