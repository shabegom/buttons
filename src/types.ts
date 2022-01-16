
declare module 'obsidian' {
  interface App {
    commands: {
     executeCommandById: (id: string) => unknown;
      listCommands: () => [{ id: string; name: string }];
      commands: Record<string, { name: string; id: string }>; 
    }
  }
}


export interface Args {
  name?: string;
  type?: string;
  action?: string;
}
