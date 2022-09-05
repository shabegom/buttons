import { h } from "preact";
import Select from "react-select";
import { customStyles } from "./select";
import { Page } from "../pages";

function fetchCommands() {
  const commands = app.commands.commands;
  return Object.keys(commands).map((key) => {
    return {
      value: commands[key].id,
      label: commands[key].name,
    };
  });
}

const CommandSelect = ({ button, setButton }: Page): h.JSX.Element => {
  function setCommandSelection(value: string): void {
    setButton({ ...button, action: value });
  }
  const options = fetchCommands();
  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={({ label }: { label: string }) => setCommandSelection(label)}
    />
  );
};

export default CommandSelect;
