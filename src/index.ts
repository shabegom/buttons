import { Plugin, MarkdownView } from "obsidian";

declare module "obsidian" {
  interface App {
    commands: {
      executeCommandById: (id: string) => unknown;
      listCommands: () => [{ id: string; name: string }];
    };
  }
}

interface Arguments {
  name?: string;
  type?: string;
  action?: string;
  style?: string;
  color?: string;
  class?: string;
  id?: string;
  remove?: string;
}

export default class ReactStarterPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerMarkdownCodeBlockProcessor("button", async (source, el) => {
      // create an object out of the arguments
      const args: Arguments = source.split("\n").reduce((acc, i: string) => {
        const split = i.split(" ");
        acc[split[0]] = split.filter((item) => item !== split[0]).join(" ");
        return acc;
      }, {});
      //handle button clicks
      const clickHandler = (args: Arguments) => {
        console.log("handling click");
        if (args.type === "command") {
          console.log("executing command:", args.action);
          const allCommands = this.app.commands.listCommands();
          const command = allCommands.filter(
            (command) =>
              command.name.toUpperCase() === args.action.toUpperCase().trim()
          )[0];
          this.app.commands.executeCommandById(command.id);
        }
        if (args.type === "link") {
          console.log("opening link: ", args.action);
          const link = args.action.trim();
          open(link);
        }
        if (args.remove) {
          setTimeout(() => removeButton(this.app, args.name), 100);
        }
      };
      //create the button element
      const button = el.createEl("button", {
        text: args.name,
        cls: args.class
          ? `${args.class} ${args.color}`
          : `button-default button-shine ${args.color ? args.color : ""}`,
      });
      args.id ? button.setAttribute("id", args.id) : "";
      button.on("click", "button", () => {
        clickHandler(args);
      });
    });
  }
}

const removeButton = async (app, buttonName: string) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  const originalContent = await app.vault.read(activeView.file);
  const button = `\u0060{3}button\nname ${buttonName}.*?remove true\n\u0060{3}`;
  const re = new RegExp(button, "gms");
  const splitContent = originalContent.split(re);
  const content = `${splitContent[0]} ${splitContent[1]}`;
  await app.vault.modify(activeView.file, content);
};
