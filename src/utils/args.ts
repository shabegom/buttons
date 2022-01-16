import {Args} from "../types"

const createArgs = (source: string): Args => {
  const args = source.split("\n").reduce((acc, line) => {
    const key = line.split(" ")[0];
    const value = line.split(" ").slice(1).join(" ");
    return { ...acc, [key]: value };
  }, {});
  return args;
}

export default createArgs;
