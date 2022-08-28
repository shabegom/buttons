const commandButton = (action: string): (() => void) => {
  const allCommands = app.commands.listCommands();
  const command = allCommands.filter(
    (command: { name: string }) =>
      command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  if (command) {
    return () => {
      app.commands.executeCommandById(command.id);
    };
  }
};

export default commandButton;
