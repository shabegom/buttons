import {Args} from "../types"

const createArgs = (source: string): Args => {
  const args = source.split("\n").reduce((acc: Args, line) => {
    const key = line.split(" ")[0];
    const value = line.split(" ").slice(1).join(" ").trim();
    if (key === "remove") {
      if (!acc.mutations) {
        acc.mutations = [];
      }
      acc.mutations.push({
        type: key,
        value,
      });
      return acc;
    }
    return { ...acc, [key]: value };
  }, {});
  return args;
}

export default createArgs;
