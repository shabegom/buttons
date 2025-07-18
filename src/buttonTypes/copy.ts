import { Arguments } from "../types";

// take the action and copy it to the clipboard
export const copy = ({ action }: Arguments): void => {
  navigator.clipboard.writeText(action);
} 