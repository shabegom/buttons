/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkdownView } from "obsidian";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getViewState = (): any => {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (view) {
    const state = view.getState();
    return state;
  }
};

export const getCurrentMode = () =>
  app.workspace.getActiveViewOfType(MarkdownView)?.getMode();

export const setSourceMode = (): void => {
  const viewState = getViewState();
  if (viewState && viewState.mode === "preview") {
    viewState.mode = "source";
    const view = app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      console.log("changing to source mode");
      view.setState(viewState, view);
    }
  }
};

export const setPreviewMode = (): void => {
  const viewState = getViewState();
  if (viewState && viewState.mode === "source") {
    viewState.mode = "preview";
    const view = app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      console.log("changing to preview mode");
      view.setState(viewState, view);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toggleMode = (func: any) => {
  return (...args: any[]) => {
    const mode = getCurrentMode();
    if (mode === "preview") {
      setSourceMode();
    }
    func.apply(args);
    if (mode === "preview") {
      setPreviewMode();
    }
  };
};
