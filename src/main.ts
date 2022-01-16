import { Plugin } from "obsidian";
import {button} from "./ui"
import {createArgs} from "./utils"
import {createOnclick} from './handlers'

export default class Buttons extends Plugin {
  onload(): void {
    console.log("Buttons loading");
    this.registerMarkdownCodeBlockProcessor("button", (source, el) => {
      const args = createArgs(source);
      const onClick = createOnclick(args);
      console.log(args);
      button(el, args.name, onClick);
    });
  }
}
