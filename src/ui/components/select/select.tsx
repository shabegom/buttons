/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from "preact";
import Select from "react-select";

export const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: "var(--text-normal)",
    backgroundColor:
      state.isFocused || state.isSelected
        ? "var(--color-blue)"
        : "var(--interactive-normal)",
  }),
  menuList: (provided: any): any => ({
    ...provided,
    background: "var(--interactive-normal)",
    fontSize: "var(--font-ui-small)",
    lineHeight: "var(--line-height-tight)",
    padding: "0 1.9em 0 0.8em",
    boxSizing: "border-box",
    color: "var(--text-normal)",
    boxShadow: "var(--input-shadow)",
    borderRadius: "var(--input-radius)",
    height: "200px",
  }),
  input: (provided: any): any => ({
    ...provided,
    color: "var(--text-normal)",
    borderWidth: "0px !important",
  }),
  control: (provided: any): any => ({
    ...provided,
    background: "var(--interactive-normal)",
    height: "var(--input-height)",
    fontSize: "var(--font-ui-small)",
    lineHeight: "var(--line-height-tight)",
    boxSizing: "border-box",
    color: "var(--text-normal)",
    // boxShadow: "var(--input-shadow)",
    // borderRadius: "var(--input-radius)",
    width: "100%",
  }),
  indicatorsContainer: () => ({
    display: "none",
  }),
};

function GenericSelect(options: Record<string, string>[]) {
  return <Select styles={customStyles} options={options} />;
}

export default GenericSelect;
