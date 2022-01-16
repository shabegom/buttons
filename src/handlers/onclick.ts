import {Args} from "../types";

const createOnclick = (args: Args) => {
  return () => {
    console.log("Clicked!");
  }
}

export default createOnclick;
