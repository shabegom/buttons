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
}

export interface ButtonCache {
  file: TFile;
  id: string;
  position: Pos;
}


