import { Plugin } from "obsidian";
import {button} from "./ui"
import {createArgs} from "./utils"
import {createOnclick} from './handlers'
import {ButtonCache} from './types'
import {buildIndex} from  './indexer'

export default class Buttons extends Plugin {
  index: ButtonCache[]
  onload(): void {
    console.log("Buttons loves you");

    // button indexing
    this.index = buildIndex(this.app)
    console.log(this.index)

    this.registerEvent(this.app.workspace.on("file-open", () => {
        this.index = buildIndex(this.app)
    }))

    this.registerEvent(this.app.vault.on("delete", () => {
      this.index = buildIndex(this.app)
    }))


    this.registerMarkdownCodeBlockProcessor("button", (source, el) => {
      const args = createArgs(source);
      console.log(args)
      const onClick = createOnclick(args, this.app, this.index);
      console.log(args);
      button(el, args.name, onClick);
    });
  }
}
