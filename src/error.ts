const showErrorMessage = (errors: string[], message: string): string => {
  const error = message.concat(errors.join("\n"));
  return error;
};

export default showErrorMessage;
