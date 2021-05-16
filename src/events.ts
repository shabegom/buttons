import { App, EventRef, TFile, MarkdownView } from "obsidian";
import { store } from "./buttonStore";

const { dispatch, getState } = store;

export const buttonEventListener = (app: App): EventRef => {
  return app.metadataCache.on("changed", async (file: TFile) => {
    if (file) {
      const cache = app.metadataCache.getFileCache(file);
      const content = await app.vault.cachedRead(file);
      dispatch({
        type: "SET_CURRENT_FILE",
        payload: { currentFile: file, fileCache: cache, content },
      });
      dispatch({
        type: "ADD_BUTTONS",
        payload: { currentFile: file, fileCache: cache, content },
      });
    }
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

export const activeLeafListener = (app: App): EventRef => {
  return app.workspace.on("active-leaf-change", async () => {
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const file = activeView.file;
      const cache = app.metadataCache.getFileCache(file);
      const content = await app.vault.cachedRead(file);
      dispatch({
        type: "SET_CURRENT_FILE",
        payload: { currentFile: file, fileCache: cache, content },
      });
    }
  });
};

export const createFileListener = (app: App): EventRef => {
  return app.vault.on("create", () => {
    dispatch({
      type: "SET_FILES",
      payload: { files: app.vault.getMarkdownFiles() },
    });
    const { files } = getState();
    if (files) {
      files.forEach(async (file) => {
        const cache = app.metadataCache.getFileCache(file);
        const content = await app.vault.cachedRead(file);
        dispatch({
          type: "ADD_BUTTONS",
          payload: { fileCache: cache, currentFile: file, content },
        });
      });
    }
  });
};

export const deleteFileListener = (app: App): EventRef => {
  return app.vault.on("delete", () => {
    dispatch({
      type: "SET_FILES",
      payload: { files: app.vault.getMarkdownFiles() },
    });
    const { files } = getState();
    if (files) {
      files.forEach(async (file) => {
        const cache = app.metadataCache.getFileCache(file);
        const content = await app.vault.cachedRead(file);
        dispatch({
          type: "ADD_BUTTONS",
          payload: { fileCache: cache, currentFile: file, content },
        });
      });
    }
  });
};

export const renameFileListener = (app: App): EventRef => {
  return app.vault.on("rename", () => {
    dispatch({
      type: "SET_FILES",
      payload: { files: app.vault.getMarkdownFiles() },
    });
    const { files } = getState();
    if (files) {
      files.forEach(async (file) => {
        const cache = app.metadataCache.getFileCache(file);
        const content = await app.vault.cachedRead(file);
        dispatch({
          type: "ADD_BUTTONS",
          payload: { fileCache: cache, currentFile: file, content },
        });
      });
    }
  });
};

export const layoutReadyListener = (app: App): EventRef => {
  return app.workspace.on("layout-ready", () => {
    dispatch({
      type: "SET_FILES",
      payload: { files: app.vault.getMarkdownFiles() },
    });
    const { files } = getState();
    if (files) {
      files.forEach(async (file) => {
        const cache = app.metadataCache.getFileCache(file);
        const content = await app.vault.cachedRead(file);
        dispatch({
          type: "ADD_BUTTONS",
          payload: { fileCache: cache, currentFile: file, content },
        });
      });
    }
  });
};
