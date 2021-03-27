import { Plugin } from "obsidian";

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
  color?: string;
  customClass?: string;
  customId?: string;
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
      };
      //create the button element
      const button = el.createEl("button", {
        text: args.name,
        cls: `button-default ${args.color ? args.color : ""} ${
          args.customClass ? args.customClass : ""
        }`,
      });
      args.customId ? button.setAttribute("id", args.customId) : "";
      button.on("click", "button", () => {
        clickHandler(args);
      });
    });
  }
}
