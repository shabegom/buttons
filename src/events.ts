import { App, EventRef, TFile } from "obsidian";

export const buttonEventListener = (
  app: App,
  callback: (app: App, file: TFile) => void
): EventRef => {
  return app.metadataCache.on("changed", (file: TFile) => {
    console.log("buttonEventListener");
    callback(app, file);
  });
};

export const initializeListener = (
  app: App,
  callback: (app: App) => void
): EventRef => {
  return app.metadataCache.on("resolved", () => {
    console.log("initializeListener");
    callback(app);
  });
};
