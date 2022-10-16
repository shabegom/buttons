import { createOnclick } from "../src/handlers";
import {
  processButtonMutations,
  processButtonType,
} from "../src/handlers/onclick";
import * as buttonTypes from "../src/handlers/buttonTypes";
import * as buttonMutations from "../src/handlers/buttonMutations";

import { app, plugin as testPlugin, testButton } from "./helpers";

jest.mock("../src/handlers/buttonTypes", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../src/handlers/buttonTypes"),
  };
});

jest.mock("../src/handlers/buttonMutations", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../src/handlers/buttonMutations"),
  };
});

window.app = app;

test("createOnclick returns a function", () => {
  const onclickFunction = createOnclick(testPlugin, testButton);
  expect(typeof onclickFunction).toBe("function");
});

test("createOnclick returns a function with a Notice if there is no type or mutation", () => {
  const undefinedArgs = Object.assign({}, testButton);
  undefinedArgs.args = undefined;
  const onclickFunction = createOnclick(testPlugin, testButton);
  expect(typeof onclickFunction).toBe("function");
});

test("processButtonMutations: remove mutation", () => {
  const spy = jest.spyOn(buttonMutations, "removeMutation");
  spy.mockReturnValue(() => "remove mutation");
  testButton.args.mutations = [{ type: "remove", value: "[1,2,3]" }];
  const mutations = processButtonMutations(testPlugin, testButton);
  expect(Array.isArray(mutations)).toBeTruthy();
  expect(mutations.length).toBe(1);
  expect(mutations[0]()).toBe("remove mutation");
});

test("processButtonMutations: replace mutation", () => {
  const spy = jest.spyOn(buttonMutations, "replaceMutation");
  spy.mockReturnValue(() => "replace mutation");
  testButton.args.mutations = [{ type: "replace", value: "[1,2]" }];
  const mutations = processButtonMutations(testPlugin, testButton);
  expect(Array.isArray(mutations)).toBeTruthy();
  expect(mutations.length).toBe(1);
  expect(mutations[0]()).toBe("replace mutation");
});

test("processButtonMutations: swap mutation", () => {
  const spy = jest.spyOn(buttonMutations, "swapMutation");
  spy.mockReturnValue(() => "swap mutation");
  testButton.args.mutations = [{ type: "swap", value: "[1,2]" }];
  const mutations = processButtonMutations(testPlugin, testButton);
  expect(Array.isArray(mutations)).toBeTruthy();
  expect(mutations.length).toBe(1);
  expect(mutations[0]()).toBe("swap mutation");
});

test("processButtonMutations: multiple mutation", () => {
  const removeSpy = jest.spyOn(buttonMutations, "removeMutation");
  removeSpy.mockReturnValue(() => "remove mutation");
  const replaceSpy = jest.spyOn(buttonMutations, "replaceMutation");
  replaceSpy.mockReturnValue(() => "replace mutation");
  const swapSpy = jest.spyOn(buttonMutations, "swapMutation");
  swapSpy.mockReturnValue(() => "swap mutation");
  testButton.args.mutations = [
    { type: "remove", value: "[1,2,3]" },
    { type: "replace", value: "[1,2]" },
    { type: "swap", value: "[1,2]" },
  ];
  const mutations = processButtonMutations(testPlugin, testButton);
  expect(Array.isArray(mutations)).toBeTruthy();
  expect(mutations.length).toBe(3);
  expect(mutations[0]()).toBe("remove mutation");
  expect(mutations[1]()).toBe("replace mutation");
  expect(mutations[2]()).toBe("swap mutation");
}),
  // processing different button types

  test("processButtonType: command button type", () => {
    const spy = jest.spyOn(buttonTypes, "commandButton");
    //eslint-disable-next-line
    spy.mockReturnValue(() => "command button");
    testButton.args.type = "command";
    const typeHandler = processButtonType(testPlugin, testButton);
    expect(typeof typeHandler).toBe("function");
    expect(typeHandler()).toBe("command button");
    spy.mockRestore();
  });

test("processButtonType: template button type", () => {
  const spy = jest.spyOn(buttonTypes, "templateButton");
  // eslint-disable-next-line
  spy.mockReturnValue(() => "template button");
  testButton.args.type = "template";
  const typeHandler = processButtonType(testPlugin, testButton);
  expect(typeof typeHandler).toBe("function");
  expect(typeHandler()).toBe("template button");
  spy.mockRestore();
});

test("processButtonType: link button type", () => {
  const spy = jest.spyOn(buttonTypes, "linkButton");
  // eslint-disable-next-line
  spy.mockReturnValue(() => "link button");
  testButton.args.type = "link";
  const typeHandler = processButtonType(testPlugin, testButton);
  expect(typeof typeHandler).toBe("function");
  expect(typeHandler()).toBe("link button");
  spy.mockRestore();
});

test("processButtonType: unknown button type", () => {
  // eslint-disable-next-line
  testButton.args.type = "unknown";
  const typeHandler = processButtonType(testPlugin, testButton);
  expect(typeHandler).toBe(undefined);
});
