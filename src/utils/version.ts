export const checkVersion = () => {
  const savedVersion = localStorage.getItem("buttonsVersion");
  const installedVersion = app.plugins.plugins.buttons.manifest.version;
  if (
    parseInt(savedVersion) < parseInt(installedVersion) ||
    savedVersion === null
  ) {
    return true;
  }
  return false;
};

export const saveVersion = () => {
  localStorage.setItem(
    "buttonsVersion",
    app.plugins.plugins.buttons.manifest.version
  );
};

const releaseNote = `
There is a major update to Buttons coming that will bring much needed improvements. The plugin has been rewritten from scratch to make it easier to squash bugs and add new features. Some existing features will also be removed. This is a warning for all Buttons users to prepare for what may break your buttons.

## Breaking Changes
- Calculate buttons are deprecated: use template buttons and  Templater to do calculations
- Text buttons are deprecated: use template buttons to add text
- Core Templates plugin is no longer supported. Use Templater.
- Button Inheritance is no longer supported (this doesn't include inline buttons, which will now work in Live Preview).
- All Buttons now run Templater, no need to add templater true

If you read that list and are like _"Hol Up! I need all those features"_. I will be forking the existing Buttons plugin which can be manually installed, but will no longer be supported.

## Buttons 1.0 Features
The biggest change is a much more reliable and safe plugin that should be easier to bugfix and build new features for. There are a few nice improvements that will come with it:
- Templater processing is greatly improved.
- New note templates can be opened in tabs/windows/splits/not at all
- Button Maker command is rewritten with a cleaner UX
- Inline buttons work in Live Preview
- Button Block IDs are hidden unless the cursor is on the line
- Swap buttons will remember their state when leaving and returning to the notes they are in
- A new documentation site with easier to read docs
- A boatload of bugfixes

## When can I get it?
It's coming soon! I want to release it as part of Obsidian October and am in the final 20% of work. That said, I will release when I'm confident I won't totally FUBAR your buttons.

Yours in Buttons,

shabegom

(this note will be deleted when you close the tab and won't appear again)
`;

const deleteIfExists = async () => {
  const file = await app.vault.getAbstractFileByPath(
    "/Buttons 1.0 is Coming.md"
  );
  if (file) {
    await app.vault.delete(file);
  }
};

export const updateWarning = async () => {
  const showReleaseNotes = checkVersion();
  if (showReleaseNotes) {
    deleteIfExists();
    const releaseNotes = await app.vault.create(
      "Buttons 1.0 is Coming.md",
      releaseNote
    );
    app.workspace
      .getLeaf(true)
      .openFile(releaseNotes, { state: { mode: "preview" } });
    saveVersion();
    setTimeout(async () => {
      const clearReleaseNotes = app.workspace.on("layout-change", async () => {
        await app.vault.delete(releaseNotes);
        app.workspace.offref(clearReleaseNotes);
      });
    }, 1000);
  }
};
