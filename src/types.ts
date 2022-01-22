import { Pos, TFile } from "obsidian";

declare module 'obsidian' {
  interface App {
    commands: {
     executeCommandById: (id: string) => unknown;
      listCommands: () => [{ id: string; name: string }];
      commands: Record<string, { name: string; id: string }>; 
    }
  }
}

interface Mutation {
  type: string;
  value: string;
}

export interface Args {
  name?: string;
  type?: string;
  action?: string;
  mutations?: Mutation[];
  id?: string;
}

export interface ButtonCache {
  file: TFile;
  args?: Args;
  button?: string;
  position: Pos;
  id: string;
}

export interface PageCache {
  args: Args;
  button: string;
  position: Pos;
  id: string;
}


