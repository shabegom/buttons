const commandButton = (action: string) => {
  const allCommands = app.commands.commands;
  const command = Object.values(allCommands).filter(
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
