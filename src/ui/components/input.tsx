import { h } from "preact";
import { StateUpdater, useState } from "preact/hooks";
import { ButtonProps } from "../buttonMaker";

function InputElement(
  value: string,
  button: ButtonProps,
  setButton: StateUpdater<ButtonProps>,
  setButtonHandler?: (value: Event) => void
): h.JSX.Element {
  const handleOnChange = (e: Event) => {
    setButtonHandler
      ? setButtonHandler(e)
      : setButton({ ...button, [value]: (e.target as HTMLInputElement).value });
  };

  return <input type="text" onChange={(e) => handleOnChange(e)} />;
}

function CheckboxInput(
  value: string,
  button: ButtonProps,
  setButton: StateUpdater<ButtonProps>
): h.JSX.Element {
  const [checked, setChecked] = useState(false);
  const handleOnChange = (e: Event) => {
    setChecked((e.target as HTMLInputElement).checked);
    setButton({ ...button, [value]: (e.target as HTMLInputElement).checked });
  };
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => handleOnChange(e)}
    />
  );
}

function SelectInput(
  value: string,
  options: string[],
  button: ButtonProps,
  setButton: StateUpdater<ButtonProps>,
  setButtonHandler: (value: Event) => void
): h.JSX.Element {
  const handleOnChange = (e: Event) => {
    if ((e.target as HTMLInputElement).value !== options[0]) {
      setButtonHandler
        ? setButtonHandler(e)
        : setButton({
            ...button,
            [value]: (e.target as HTMLInputElement).value,
          });
    }
  };
  const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <select onChange={(e) => handleOnChange(e)}>
      {options.map((option) => {
        return (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        );
      })}
    </select>
  );
}

export const makeInput =
  (button: ButtonProps, setButton: StateUpdater<ButtonProps>) =>
  (
    type: string,
    value: string,
    options?: string[],
    setButtonHandler?: (value: Event) => void
  ) => {
    switch (type) {
      case "input":
        return InputElement(value, button, setButton, setButtonHandler);
      case "select":
        return SelectInput(value, options, button, setButton, setButtonHandler);
      case "checkbox":
        return CheckboxInput(value, button, setButton);
    }
  };
