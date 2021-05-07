import { App, EventRef, TFile } from "obsidian";

export const buttonEventListener = (
  app: App,
  callback: (app: App, file: TFile) => void
): EventRef => {
  return app.metadataCache.on("changed", (file: TFile) => {
    callback(app, file);
  });
};

export const initializeListener = (
  app: App,
  callback: (app: App) => void
): EventRef => {
  return app.metadataCache.on("resolved", () => {
    callback(app);
  });
};

export const openFileListener = (
  app: App,
  callback: (app: App) => void
): EventRef => {
  return app.workspace.on("file-open", () => {
    callback(app);
  });
};
