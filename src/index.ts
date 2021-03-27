import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { h, render, VNode } from "preact";

import DiceRoller from "./ui/DicerRoller.tsx";

const VIEW_TYPE = "react-view";

class MyReactView extends ItemView {
  private reactComponent: VNode;

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Dice Roller";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = h(DiceRoller, {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(this.reactComponent, (this as any).contentEl);
  }
}

export default class ReactStarterPlugin extends Plugin {
  private view: MyReactView;

  async onload(): Promise<void> {
    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => (this.view = new MyReactView(leaf))
    );

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
    });
  }
}
