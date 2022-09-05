import { h } from "preact";
import Select from "react-select";
import { customStyles } from "./select";
import { Page } from "../pages";

function fetchTemplates() {
  const templateFolder =
    app.plugins.plugins["templater-obsidian"].settings.template_folder;
  const templates = app.vault
    .getMarkdownFiles()
    .filter((file) => {
      return file.path.includes(templateFolder);
    })
    .map((file) => {
      return {
        value: file.basename,
        label: file.basename,
      };
    });
  return templates;
}

const TemplatesSelect = ({ button, setButton }: Page): h.JSX.Element => {
  function setTemplateSelection(value: string): void {
    setButton({ ...button, action: value });
  }
  const options = fetchTemplates();
  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={({ label }: { label: string }) => setTemplateSelection(label)}
    />
  );
};

export default TemplatesSelect;
