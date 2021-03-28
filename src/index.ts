import { Plugin, MarkdownView, TFile, App, Notice } from "obsidian";

//extend the obsidian module with some additional typings
declare module "obsidian" {
  interface App {
    internalPlugins: {
      plugins: {
        templates: {
          enabled: boolean;
          instance: {
            options: {
              folder: string;
            };
          };
        };
      };
    };
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

export default class ButtonsPLugin extends Plugin {
  async onload(): Promise<void> {
    this.registerMarkdownCodeBlockProcessor("button", async (source, el) => {
      // create an object out of the arguments
      const args: Arguments = source.split("\n").reduce((acc, i: string) => {
        const split = i.split(" ");
        acc[split[0]] = split.filter((item) => item !== split[0]).join(" ");
        return acc;
      }, {});
      //handle button clicks
      const clickHandler = async (args: Arguments) => {
        console.log("handling click");
        //handle command buttons
        if (args.type === "command") {
          const allCommands = this.app.commands.listCommands();
          const command = allCommands.filter(
            (command) =>
              command.name.toUpperCase() === args.action.toUpperCase().trim()
          )[0];
          this.app.commands.executeCommandById(command.id);
        }
        //handle link buttons
        if (args.type === "link") {
          console.log("opening link: ", args.action);
          const link = args.action.trim();
          window.open(link);
        }
        //handle template buttons
        if (args.type.includes("template")) {
          const templatesEnabled = this.app.internalPlugins.plugins.templates
            .enabled;
          //only run if templates plugin is enabled
          if (templatesEnabled) {
            const folder = this.app.internalPlugins.plugins.templates.instance
              .options.folder;
            const allFiles = this.app.vault.getFiles();
            const file: TFile = allFiles.filter(
              (file) => file.path === `${folder}/${args.action}.md`
            )[0];
            if (file) {
              const content = await this.app.vault.read(file);
              //prepend template above the button
              if (args.type.includes("prepend")) {
                prependContent(this.app, content, args.name);
                setTimeout(
                  () =>
                    this.app.commands.executeCommandById(
                      "templater-obsidian:replace-in-file-templater"
                    ),
                  100
                );
              }
              // append template below the button
              if (args.type.includes("append")) {
                appendContent(this.app, content, args.name);
                setTimeout(
                  () =>
                    this.app.commands.executeCommandById(
                      "templater-obsidian:replace-in-file-templater"
                    ),
                  100
                );
              }
            } else {
              new Notice(
                `Couldn't find the specified template, please check and try again`,
                2000
              );
            }
          } else {
            new Notice("You need to have the Templates plugin enabled", 2000);
          }
        }
        //handle removing the button
        if (args.remove) {
          setTimeout(() => removeButton(this.app, args.name), 100);
        }
      };
      //create the button element
      const button = el.createEl("button", {
        text: args.name,
        cls: args.class
          ? `${args.class} ${args.color}`
          : `button-default ${args.color ? args.color : ""}`,
      });
      args.id ? button.setAttribute("id", args.id) : "";
      button.on("click", "button", () => {
        clickHandler(args);
      });
    });
  }
}

const removeButton = async (app: App, buttonName: string) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const button = `\u0060{3}button\nname ${buttonName}.*?remove true\n\u0060{3}`;
    const re = new RegExp(button, "gms");
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0]} ${splitContent[1]}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue adding content, please try again", 2000);
  }
};

const prependContent = async (app: App, insert: string, buttonName: string) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const buttonRegex = `\u0060{3}button\nname ${buttonName}.*?\n\u0060{3}`;
    const re = new RegExp(buttonRegex, "gms");
    const button = originalContent.match(re)[0];
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0] ? splitContent[0] : ""}
${insert}
${button}
${splitContent[1] ? splitContent[1] : ""}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue prepending content, please try again", 2000);
  }
};

const appendContent = async (app: App, insert: string, buttonName: string) => {
  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView) {
    const file = activeView.file;
    const originalContent = await app.vault.read(file);
    const buttonRegex = `\u0060{3}button\nname ${buttonName}.*?\n\u0060{3}`;
    const re = new RegExp(buttonRegex, "gms");
    const button = originalContent.match(re);
    const splitContent = originalContent.split(re);
    const content = `${splitContent[0] ? splitContent[0] : ""}
${button}
${insert}
${splitContent[1] ? splitContent[1] : ""}`;
    await app.vault.modify(file, content);
  } else {
    new Notice("There was an issue appending content, please try again", 2000);
  }
};
