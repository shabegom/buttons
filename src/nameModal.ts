import { App, Modal, Setting } from "obsidian";

export class nameModal extends Modal {
  result: string;
  defaultName: string;
  onSubmit: (result: string) => void;

  constructor(
    app: App,
    onSubmit: (result: string) => void,
    defaultName: string
  ) {
    super(app);
    this.onSubmit = onSubmit;
    this.defaultName = defaultName;
  }

  onOpen(): void {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Name of new note" });

    new Setting(contentEl).setName("Name").addText((text) => {
      text.setPlaceholder(this.defaultName);
      text.onChange((value: string) => {
        this.result = value;
      });
    });

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Create Note")
        .setCta()
        .onClick(() => {
          this.close();
          this.onSubmit(this.result);
        })
    );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
